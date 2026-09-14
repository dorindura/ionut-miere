import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPrisma } from "@/lib/db";
import { getOrCreateCart } from "@/lib/cart";
import { shippingRonFor } from "@/lib/shipping";
import { isCardPaymentEnabled } from "@/lib/netopia";
import { sendOrderEmailsById, startOrderCardPayment } from "@/lib/orders";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
    const prisma = getPrisma();
    const session = await getServerSession(authOptions);

    const form = await req.formData();

    const email = String(form.get("email") || "").trim().toLowerCase();
    const fullName = String(form.get("fullName") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const address = String(form.get("address") || "").trim();
    const city = String(form.get("city") || "").trim();
    const county = String(form.get("county") || "").trim();
    const postalCode = String(form.get("postalCode") || "").trim();

    const deliveryMethod = String(form.get("deliveryMethod") || "ADDRESS");
    const isCard = String(form.get("paymentMethod") || "") === "CARD";

    const easyboxId = String(form.get("easyboxId") || "").trim();
    const easyboxName = String(form.get("easyboxName") || "").trim();
    const easyboxAddress = String(form.get("easyboxAddress") || "").trim();
    const easyboxCity = String(form.get("easyboxCity") || "").trim();
    const easyboxCounty = String(form.get("easyboxCounty") || "").trim();
    const easyboxPostalCode = String(form.get("easyboxPostalCode") || "").trim();

    const isEasybox = deliveryMethod === "EASYBOX";

    // câmpuri de facturare obligatorii
    if (!email || !EMAIL_RE.test(email) || !fullName || !phone) {
        return NextResponse.redirect(new URL("/checkout?error=date", req.url), 303);
    }

    if (!isEasybox && (!address || !city || !county)) {
        return NextResponse.redirect(new URL("/checkout?error=adresa", req.url), 303);
    }

    if (isEasybox && (!easyboxId || !easyboxName || !easyboxAddress)) {
        return NextResponse.redirect(new URL("/checkout?error=easybox", req.url), 303);
    }

    if (isCard && !isCardPaymentEnabled()) {
        return NextResponse.redirect(new URL("/checkout?error=card", req.url), 303);
    }

    // utilizatorul logat (dacă există) - comanda se leagă de cont
    const user = session?.user?.email
        ? await prisma.user.findUnique({ where: { email: session.user.email } })
        : null;

    const cart = await getOrCreateCart(false);

    const items = cart
        ? await prisma.cartItem.findMany({
              where: { cartId: cart.id },
              include: { product: true },
          })
        : [];

    if (items.length === 0) {
        return NextResponse.redirect(new URL("/cos", req.url), 303);
    }

    const subtotalRon = items.reduce((sum, it) => sum + it.qty * it.product.priceRon, 0);
    const shippingRon = shippingRonFor(isEasybox ? "EASYBOX" : "ADDRESS");
    const totalRon = subtotalRon + shippingRon;

    const order = await prisma.order.create({
        data: {
            userId: user?.id ?? null,
            email,
            fullName,
            phone,
            address: isEasybox ? null : address,
            city: isEasybox ? null : city,
            county: isEasybox ? null : county,
            postalCode: isEasybox ? null : postalCode || null,
            deliveryMethod: isEasybox ? "EASYBOX" : "ADDRESS",
            easyboxId: isEasybox ? easyboxId : null,
            easyboxName: isEasybox ? easyboxName : null,
            easyboxAddress: isEasybox ? easyboxAddress : null,
            easyboxCity: isEasybox ? easyboxCity : null,
            easyboxCounty: isEasybox ? easyboxCounty : null,
            easyboxPostalCode: isEasybox ? easyboxPostalCode : null,
            paymentMethod: isCard ? "CARD" : "CASH_ON_DELIVERY",
            paymentStatus: isCard ? "PENDING" : "UNPAID",
            totalRon,
            shippingRon,
            status: "PENDING",
            items: {
                create: items.map((it) => ({
                    productId: it.productId,
                    name: it.product.name,
                    priceRon: it.product.priceRon,
                    weight: it.product.weight,
                    qty: it.qty,
                })),
            },
        },
        select: { id: true },
    });

    // golim coșul
    await prisma.cartItem.deleteMany({ where: { cartId: cart!.id } });

    if (isCard) {
        // emailurile pleacă abia după confirmarea plății (IPN NETOPIA)
        const paymentUrl = await startOrderCardPayment(order.id, req);
        return NextResponse.redirect(
            paymentUrl ?? new URL(`/comanda/${order.id}?plata=eroare`, req.url),
            303,
        );
    }

    // ramburs: trimitem emailurile (proprietar + client); nu blocăm comanda dacă eșuează
    await sendOrderEmailsById(order.id);

    return NextResponse.redirect(new URL(`/comanda/${order.id}`, req.url), 303);
}
