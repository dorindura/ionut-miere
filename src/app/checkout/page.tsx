import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import {getPrisma} from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
    const prisma = getPrisma();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/cont/login");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { cart: { include: { items: { include: { product: true } } } } },
    });

    const items = user?.cart?.items ?? [];
    if (items.length === 0) redirect("/cos");

    const totalRon = items.reduce((sum, it) => sum + it.qty * it.product.priceRon, 0);

    return (
        <main className="mx-auto max-w-6xl px-4 py-12">
            <h1 className="text-3xl font-black">Checkout</h1>
            <p className="mt-2 text-neutral-300">Plată ramburs la livrare.</p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
                <form
                    action="/api/checkout"
                    method="POST"
                    className="rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6 grid gap-3"
                >
                    <label className="grid gap-1 text-sm">
                        <span className="text-neutral-200">Nume complet</span>
                        <input
                            name="fullName"
                            required
                            className="rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span className="text-neutral-200">Telefon</span>
                        <input
                            name="phone"
                            required
                            className="rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span className="text-neutral-200">Adresă livrare</span>
                        <textarea
                            name="address"
                            required
                            className="min-h-[120px] rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                        />
                    </label>

                    <button
                        type="submit"
                        className="mt-2 rounded-xl bg-yellow-500 px-6 py-3 text-sm font-semibold text-neutral-950 hover:bg-yellow-400"
                    >
                        Plasează comanda
                    </button>

                    <p className="text-xs text-neutral-400">
                        *Ramburs. După lansare: email confirmare + AWB + status.
                    </p>
                </form>

                <aside className="rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6">
                    <h2 className="text-xl font-black">Sumar</h2>
                    <div className="mt-4 grid gap-3">
                        {items.map((it) => (
                            <div key={it.id} className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="font-semibold">{it.product.name}</p>
                                    <p className="text-sm text-neutral-300">
                                        {it.product.weight} • {it.qty} x {it.product.priceRon} RON
                                    </p>
                                </div>
                                <p className="font-semibold text-yellow-300">
                                    {it.qty * it.product.priceRon} RON
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 border-t border-yellow-500/10 pt-4 flex items-center justify-between">
                        <p className="text-sm text-neutral-300">Total</p>
                        <p className="text-2xl font-black text-yellow-300">{totalRon} RON</p>
                    </div>
                </aside>
            </div>
        </main>
    );
}