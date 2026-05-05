import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPrisma } from "@/lib/db";

export async function POST(req: Request) {
    const prisma = getPrisma();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.redirect(new URL("/cont/login", req.url));
    }

    const form = await req.formData();

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

    if (!fullName || !phone) {
        return NextResponse.redirect(new URL("/checkout", req.url));
    }

    if (!isEasybox && !address) {
        return NextResponse.redirect(new URL("/checkout", req.url));
    }

    if (isEasybox && (!easyboxId || !easyboxName || !easyboxAddress)) {
        return NextResponse.redirect(new URL("/checkout", req.url));
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            cart: {
                include: {
                    items: { include: { product: true } },
                },
            },
        },
    });

    const items = user?.cart?.items ?? [];

    if (!user || items.length === 0) {
        return NextResponse.redirect(new URL("/cos", req.url));
    }

    const totalRon = items.reduce((sum, it) => sum + it.qty * it.product.priceRon, 0);

    const order = await prisma.order.create({
        data: {
            userId: user.id,
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
        select: { id: true },
    });

    if (user.cart?.id) {
        await prisma.cartItem.deleteMany({ where: { cartId: user.cart.id } });
    }

    return NextResponse.redirect(new URL(`/comanda/${order.id}`, req.url));
}