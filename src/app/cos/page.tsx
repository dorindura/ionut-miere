import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import CartItemActions from "@/components/CartItemActions";
import {getPrisma} from "@/lib/db";

export default async function CartPage() {
    const prisma = getPrisma();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/cont/login");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            cart: {
                include: {
                    items: {
                        include: { product: { include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } } } },
                        orderBy: { updatedAt: "desc" },
                    },
                },
            },
        },
    });

    const items = user?.cart?.items ?? [];

    const totalRon = items.reduce((sum, it) => sum + it.qty * it.product.priceRon, 0);

    return (
        <main className="mx-auto max-w-6xl px-4 py-12">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-black">Coș</h1>
                    <p className="mt-2 text-neutral-300">Produsele tale din coș.</p>
                </div>

                <Link
                    href="/magazin"
                    className="inline-flex rounded-xl border border-yellow-500/25 px-4 py-2 text-sm hover:border-yellow-400/60"
                >
                    Continuă cumpărăturile
                </Link>
            </div>

            {items.length === 0 ? (
                <div className="mt-10 rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6">
                    <p className="text-neutral-300">Coșul este gol.</p>
                </div>
            ) : (
                <>
                    <div className="mt-8 grid gap-4">
                        {items.map((it) => (
                            <div
                                key={it.id}
                                className="rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-lg font-bold">{it.product.name}</p>
                                        <p className="text-sm text-neutral-300">
                                            {it.product.weight} • {it.product.priceRon} RON
                                        </p>
                                        <div className="mt-3">
                                            <p className="text-xs text-neutral-400 mb-2">Cantitate</p>
                                            <CartItemActions productId={it.productId} qty={it.qty} />
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm text-neutral-300">Subtotal</p>
                                        <p className="text-lg font-black text-yellow-300">
                                            {it.qty * it.product.priceRon} RON
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex flex-col gap-3 rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm text-neutral-300">Total</p>
                            <p className="text-2xl font-black text-yellow-300">{totalRon} RON</p>
                            <p className="mt-1 text-xs text-neutral-400">Plată ramburs la livrare.</p>
                        </div>

                        <Link
                            href="/checkout"
                            className="rounded-xl bg-yellow-500 px-6 py-3 text-sm font-semibold text-neutral-950 hover:bg-yellow-400 text-center"
                        >
                            Mergi la checkout
                        </Link>
                    </div>
                </>
            )}
        </main>
    );
}