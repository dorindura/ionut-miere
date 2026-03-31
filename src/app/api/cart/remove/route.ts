import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import {getPrisma} from "@/lib/db";

export async function POST(req: Request) {
    const prisma = getPrisma();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const productId = String(body?.productId || "");
    if (!productId) return NextResponse.json({ error: "Missing productId" }, { status: 400 });

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { cart: true },
    });

    if (!user?.cart?.id) return NextResponse.json({ ok: true });

    await prisma.cartItem.deleteMany({
        where: { cartId: user.cart.id, productId },
    });

    return NextResponse.json({ ok: true });
}