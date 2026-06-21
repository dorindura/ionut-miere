import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { getOrCreateCart } from "@/lib/cart";

type UpdateCartBody = {
    productId?: string;
    qty?: number | string;
};

export async function POST(req: Request) {
    const prisma = getPrisma();

    const body = (await req.json().catch(() => ({}))) as UpdateCartBody;
    const productId = String(body.productId || "");
    const qtyRaw = Number(body.qty);

    if (!productId || !Number.isFinite(qtyRaw)) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const qty = Math.max(0, Math.floor(qtyRaw));

    const cart = await getOrCreateCart(false);
    if (!cart) return NextResponse.json({ ok: true });

    if (qty === 0) {
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
        return NextResponse.json({ ok: true });
    }

    await prisma.cartItem.updateMany({
        where: { cartId: cart.id, productId },
        data: { qty },
    });

    return NextResponse.json({ ok: true });
}
