import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import {getPrisma} from "@/lib/db";


export default async function CartBadge() {
    const prisma = getPrisma();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { cart: { include: { items: true } } },
    });

    const count = user?.cart?.items?.reduce((sum, it) => sum + it.qty, 0) ?? 0;

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