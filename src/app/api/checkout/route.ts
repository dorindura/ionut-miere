import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPrisma } from "@/lib/db";
import { getOrCreateCart } from "@/lib/cart";
import { sendOrderEmails } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
    const prisma = getPrisma();
    const session = await getServerSession(authOptions);

    const form = await req.formData();

    const email = String(form.get("email") || "").trim().toLowerCase();
    const fullName = String(form.get("fullName") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const address = String(form.get("address") || "").trim();

    const deliveryMethod = String(form.get("deliveryMethod") || "ADDRESS");

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

    if (!isEasybox && !address) {
        return NextResponse.redirect(new URL("/checkout?error=adresa", req.url), 303);
    }

    if (isEasybox && (!easyboxId || !easyboxName || !easyboxAddress)) {
        return NextResponse.redirect(new URL("/checkout?error=easybox", req.url), 303);
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

    const totalRon = items.reduce((sum, it) => sum + it.qty * it.product.priceRon, 0);

    const order = await prisma.order.create({
        data: {
            userId: user?.id ?? null,
            email,
            fullName,
            phone,
            address: isEasybox ? null : address,
            deliveryMethod: isEasybox ? "EASYBOX" : "ADDRESS",
            easyboxId: isEasybox ? easyboxId : null,
            easyboxName: isEasybox ? easyboxName : null,
            easyboxAddress: isEasybox ? easyboxAddress : null,
            easyboxCity: isEasybox ? easyboxCity : null,
            easyboxCounty: isEasybox ? easyboxCounty : null,
            easyboxPostalCode: isEasybox ? easyboxPostalCode : null,
            totalRon,
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
        select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            totalRon: true,
            createdAt: true,
            deliveryMethod: true,
            address: true,
            easyboxName: true,
            easyboxAddress: true,
            easyboxCity: true,
            easyboxCounty: true,
            easyboxPostalCode: true,
            items: { select: { name: true, weight: true, priceRon: true, qty: true } },
        },
    });

    // golim coșul
    await prisma.cartItem.deleteMany({ where: { cartId: cart!.id } });

    // trimitem emailurile (proprietar + client); nu blocăm comanda dacă eșuează
    try {
        await sendOrderEmails({
            id: order.id,
            email: order.email,
            fullName: order.fullName ?? "",
            phone: order.phone ?? "",
            totalRon: order.totalRon,
            createdAt: order.createdAt,
            deliveryMethod: order.deliveryMethod,
            address: order.address,
            easyboxName: order.easyboxName,
            easyboxAddress: order.easyboxAddress,
            easyboxCity: order.easyboxCity,
            easyboxCounty: order.easyboxCounty,
            easyboxPostalCode: order.easyboxPostalCode,
            items: order.items,
        });
    } catch (e) {
        console.error("[checkout] eroare la trimiterea emailurilor", e);
    }

    return NextResponse.redirect(new URL(`/comanda/${order.id}`, req.url), 303);
}
