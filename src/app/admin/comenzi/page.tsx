import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {getPrisma} from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
    const prisma = getPrisma();
    const session = await getServerSession(authOptions);
    if (!session || (session as any).role !== "ADMIN") {
        redirect("/admin/login");
    }

    const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: true,
            items: true,
        },
    });

    return (
        <main className="mx-auto max-w-6xl px-4 py-12">
            <h1 className="text-3xl font-black">Comenzi</h1>

            <div className="mt-8 space-y-4">
                {orders.map((o) => (
                    <Link
                        key={o.id}
                        href={`/admin/comenzi/${o.id}`}
                        className="block rounded-2xl border border-yellow-500/15 bg-neutral-900/30 p-5 hover:border-yellow-400/40"
                    >
                        <div className="flex justify-between">
                            <div>
                                <p className="text-sm text-neutral-400">
                                    {o.user.email}
                                </p>
                                <p className="text-lg font-bold">
                                    {o.totalRon} RON
                                </p>
                                <p className="mt-1 text-xs text-neutral-400">
                                    {o.deliveryMethod === "EASYBOX"
                                        ? `easybox: ${o.easyboxName ?? "nespecificat"}`
                                        : "livrare la adresă"}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-sm">{o.status}</p>
                                {o.phoneConfirmed && (
                                    <p className="text-xs text-yellow-300">
                                        Confirmat telefonic
                                    </p>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}