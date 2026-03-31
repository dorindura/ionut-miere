import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function OrderPlacedPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
    });

    if (!order) return notFound();

    return (
        <main className="mx-auto max-w-3xl px-4 py-12">
            <h1 className="text-3xl font-black">Comandă plasată ✅</h1>
            <p className="mt-2 text-neutral-300">
                ID comandă: <span className="text-yellow-300 font-semibold">{order.id}</span>
            </p>

            <div className="mt-8 rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6">
                <h2 className="text-xl font-black">Sumar</h2>
                <div className="mt-4 grid gap-2">
                    {order.items.map((it) => (
                        <div key={it.id} className="flex justify-between gap-4 text-sm">
              <span className="text-neutral-200">
                {it.name} ({it.weight}) • {it.qty} buc
              </span>
                            <span className="text-yellow-300 font-semibold">{it.qty * it.priceRon} RON</span>
                        </div>
                    ))}
                </div>

                <div className="mt-6 border-t border-yellow-500/10 pt-4 flex items-center justify-between">
                    <span className="text-neutral-300">Total</span>
                    <span className="text-2xl font-black text-yellow-300">{order.totalRon} RON</span>
                </div>

                <p className="mt-3 text-xs text-neutral-400">
                    Plată ramburs la livrare. Te contactăm pentru confirmare.
                </p>
            </div>

            <div className="mt-8 flex gap-3">
                <Link
                    href="/magazin"
                    className="rounded-xl bg-yellow-500 px-6 py-3 text-sm font-semibold text-neutral-950 hover:bg-yellow-400"
                >
                    Înapoi la magazin
                </Link>
                <Link
                    href="/cont/comenzi"
                    className="rounded-xl border border-yellow-500/25 px-6 py-3 text-sm font-semibold hover:border-yellow-400/60"
                >
                    Comenzile mele
                </Link>
            </div>
        </main>
    );
}