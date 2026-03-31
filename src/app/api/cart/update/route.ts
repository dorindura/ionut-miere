import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPrisma } from "@/lib/db";

type UpdateCartBody = {
    productId?: string;
    qty?: number | string;
};

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const prisma = getPrisma();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as UpdateCartBody;
    const productId = String(body.productId || "");
    const qtyRaw = Number(body.qty);

    if (!productId || !Number.isFinite(qtyRaw)) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const qty = Math.max(0, Math.floor(qtyRaw));

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { cart: true },
    });

    if (!user?.cart?.id) return NextResponse.json({ ok: true });

    const cartId = user.cart.id;

    if (qty === 0) {
        await prisma.cartItem.deleteMany({
            where: { cartId, productId },
        });
        return NextResponse.json({ ok: true });
    }

    await prisma.cartItem.updateMany({
        where: { cartId, productId },
        data: { qty },
    });

    return NextResponse.json({ ok: true });
}