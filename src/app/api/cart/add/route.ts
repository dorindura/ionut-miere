import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import {getPrisma} from "@/lib/db";

export async function POST(req: Request) {
    const prisma = getPrisma();
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const slug = String(body?.slug || "");
    const qty = Math.max(1, Number(body?.qty || 1) || 1);

    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const cart = await prisma.cart.upsert({
        where: { userId: user.id },
        create: { userId: user.id },
        update: {},
    });

    await prisma.cartItem.upsert({
        where: { cartId_productId: { cartId: cart.id, productId: product.id } },
        create: { cartId: cart.id, productId: product.id, qty },
        update: { qty: { increment: qty } },
    });

    return NextResponse.json({ ok: true });
}