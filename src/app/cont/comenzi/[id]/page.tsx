import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function OrderDetailsPage({
                                                   params,
                                               }: {
    params: Promise<{ id: string }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/cont/login");

    const { id } = await params;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
    });
    if (!user) redirect("/cont/login");

    const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
    });
    if (!order) return notFound();

    // securitate: user vede doar comanda lui
    if (order.userId !== user.id) return notFound();

    return (
        <main className="mx-auto max-w-3xl px-4 py-12">
            <div className="flex items-end justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-black">Detalii comandă</h1>
                    <p className="mt-2 text-neutral-300">
                        ID: <span className="text-yellow-300 font-semibold">{order.id}</span>
                    </p>
                </div>
                <Link
                    href="/cont/comenzi"
                    className="rounded-xl border border-yellow-500/25 px-4 py-2 text-sm hover:border-yellow-400/60"
                >
                    Înapoi
                </Link>
            </div>

            <section className="mt-8 rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-neutral-400">Status</p>
                        <p className="text-sm font-semibold">{order.status}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-neutral-400">Total</p>
                        <p className="text-2xl font-black text-yellow-300">{order.totalRon} RON</p>
                    </div>
                </div>

                <div className="mt-6 border-t border-yellow-500/10 pt-4 text-sm text-neutral-300">
                    <p><span className="text-neutral-200 font-semibold">Nume:</span> {order.fullName}</p>
                    <p><span className="text-neutral-200 font-semibold">Telefon:</span> {order.phone}</p>
                    <p><span className="text-neutral-200 font-semibold">Adresă:</span> {order.address}</p>
                </div>
            </section>

            <section className="mt-6 rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6">
                <h2 className="text-xl font-black">Produse</h2>

                <div className="mt-4 grid gap-3">
                    {order.items.map((it) => (
                        <div key={it.id} className="flex items-start justify-between gap-4 text-sm">
                            <div>
                                <p className="font-semibold text-neutral-100">{it.name}</p>
                                <p className="text-neutral-300">{it.weight} • {it.qty} buc • {it.priceRon} RON</p>
                            </div>
                            <p className="font-semibold text-yellow-300">{it.qty * it.priceRon} RON</p>
                        </div>
                    ))}
                </div>
            </section>

            <p className="mt-4 text-xs text-neutral-400">
                *Plată ramburs la livrare. Pentru modificări, contactează suportul.
            </p>
        </main>
    );
}