import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/db";
import PaymentBadge from "@/components/PaymentBadge";

export const metadata = {
    title: "Comenzile mele",
    description: "Istoric comenzi.",
};

export const dynamic = "force-dynamic";

export default async function MyOrdersPage() {
    const prisma = getPrisma();
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
                    <h1 className="text-3xl font-extrabold">Comenzile mele</h1>
                    <p className="mt-2 text-ink-2">Istoric comenzi.</p>
                </div>

                <Link
                    href="/magazin"
                    className="btn btn-ghost"
                >
                    Înapoi la magazin
                </Link>
            </div>

            {orders.length === 0 ? (
                <div className="mt-10 sheet p-6">
                    <p className="text-ink-2">Nu ai încă nicio comandă.</p>
                    <Link
                        href="/magazin"
                        className="mt-4 inline-flex btn btn-primary"
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
                            className="sheet p-6 transition-colors hover:border-ink-3"
                        >
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-sm text-ink-2">Comandă</p>
                                    <p className="font-bold text-ink">{o.id}</p>
                                    <p className="mt-1 text-xs text-ink-3">
                                        {new Date(o.createdAt).toLocaleString("ro-RO")}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="text-xs text-ink-3">Status</p>
                                        <p className="text-sm font-semibold">{o.status}</p>
                                        <div className="mt-1">
                                            <PaymentBadge method={o.paymentMethod} status={o.paymentStatus} />
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-ink-3">Total</p>
                                        <p className="text-lg font-extrabold text-ink">{o.totalRon} lei</p>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-3 text-sm text-ink-2 line-clamp-2">
                                {o.items.slice(0, 3).map((it) => it.name).join(", ")}
                                {o.items.length > 3 ? "..." : ""}
                            </p>

                            <p className="mt-3 text-sm text-ink">Vezi detalii →</p>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}