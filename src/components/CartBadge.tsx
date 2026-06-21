import Link from "next/link";
import { getPrisma } from "@/lib/db";
import { getOrCreateCart } from "@/lib/cart";

export default async function CartBadge() {
    const prisma = getPrisma();
    const cart = await getOrCreateCart(false);

    const items = cart
        ? await prisma.cartItem.findMany({ where: { cartId: cart.id }, select: { qty: true } })
        : [];

    const count = items.reduce((sum, it) => sum + it.qty, 0);

    return (
        <Link
            href="/cos"
            className="rounded-xl border border-yellow-500/25 px-3 py-2 text-sm hover:border-yellow-400/60"
        >
            Coș
            {count > 0 ? (
                <span className="ml-2 rounded-full bg-yellow-500 px-2 py-0.5 text-xs font-bold text-neutral-950">
          {count}
        </span>
            ) : null}
        </Link>
    );
}
