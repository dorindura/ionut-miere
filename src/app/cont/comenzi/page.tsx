import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata = {
    title: "Comenzile mele",
    description: "Istoric comenzi.",
};

export default async function MyOrdersPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/cont/login");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
    });
    if (!user) redirect("/cont/login");

    const orders = await prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: { items: true },
    });

    return (
        <main className="mx-auto max-w-6xl px-4 py-12">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-black">Comenzile mele</h1>
                    <p className="mt-2 text-neutral-300">Istoric comenzi ramburs.</p>
                </div>

                <Link
                    href="/magazin"
                    className="inline-flex rounded-xl border border-yellow-500/25 px-4 py-2 text-sm hover:border-yellow-400/60"
                >
                    Înapoi la magazin
                </Link>
            </div>

            {orders.length === 0 ? (
                <div className="mt-10 rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6">
                    <p className="text-neutral-300">Nu ai încă nicio comandă.</p>
                    <Link
                        href="/magazin"
                        className="mt-4 inline-flex rounded-xl bg-yellow-500 px-5 py-3 text-sm font-semibold text-neutral-950 hover:bg-yellow-400"
                    >
                        Vezi produsele
                    </Link>
                </div>
            ) : (
                <div className="mt-8 grid gap-4">
                    {orders.map((o) => (
                        <Link
                            key={o.id}
                            href={`/cont/comenzi/${o.id}`}
                            className="rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6 hover:border-yellow-400/40 transition-colors"
                        >
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-sm text-neutral-300">Comandă</p>
                                    <p className="font-bold text-yellow-200">{o.id}</p>
                                    <p className="mt-1 text-xs text-neutral-400">
                                        {new Date(o.createdAt).toLocaleString("ro-RO")}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="text-xs text-neutral-400">Status</p>
                                        <p className="text-sm font-semibold">{o.status}</p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-neutral-400">Total</p>
                                        <p className="text-lg font-black text-yellow-300">{o.totalRon} RON</p>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-3 text-sm text-neutral-300 line-clamp-2">
                                {o.items.slice(0, 3).map((it) => it.name).join(", ")}
                                {o.items.length > 3 ? "..." : ""}
                            </p>

                            <p className="mt-3 text-sm text-neutral-200">Vezi detalii →</p>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}