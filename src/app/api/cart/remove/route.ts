import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { getOrCreateCart } from "@/lib/cart";

type RemoveCartBody = {
    productId?: string;
};

export async function POST(req: Request) {
    const prisma = getPrisma();

    const body = (await req.json().catch(() => ({}))) as RemoveCartBody;
    const productId = String(body.productId || "");

    if (!productId) {
        return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const cart = await getOrCreateCart(false);
    if (!cart) return NextResponse.json({ ok: true });

    await prisma.cartItem.deleteMany({
        where: { cartId: cart.id, productId },
    });

    return NextResponse.json({ ok: true });
}
