import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import {getPrisma} from "@/lib/db";
import DeleteOrderButton from "@/components/DeleteOrderButton";

export const dynamic = "force-dynamic";

async function deleteOrder(formData: FormData) {
    "use server";

    // server action = endpoint public -> verificăm rolul admin aici
    const session = await getServerSession(authOptions);
    if (!session || (session as any).role !== "ADMIN") {
        redirect("/admin/login");
    }

    const orderId = String(formData.get("orderId") || "");
    if (!orderId) return;

    const prisma = getPrisma();
    // produsele comenzii (OrderItem) se șterg în cascadă
    await prisma.order.delete({ where: { id: orderId } });

    revalidatePath("/admin/comenzi");
}

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

    const dateFmt = new Intl.DateTimeFormat("ro-RO", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Europe/Bucharest",
    });

    return (
        <main className="mx-auto max-w-6xl px-4 py-12">
            <h1 className="text-3xl font-black">Comenzi</h1>

            <div className="mt-8 space-y-4">
                {orders.map((o) => (
                    <div
                        key={o.id}
                        className="relative rounded-2xl border border-yellow-500/15 bg-neutral-900/30 transition-colors hover:border-yellow-400/40"
                    >
                        <Link href={`/admin/comenzi/${o.id}`} className="block p-5 pr-16">
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-yellow-300/90">
                                        {dateFmt.format(o.createdAt)}
                                    </p>
                                    <p className="mt-0.5 text-sm text-neutral-400">
                                        {o.email}
                                        {o.user ? "" : " • fără cont"}
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

                        <div className="absolute right-4 top-4">
                            <DeleteOrderButton
                                orderId={o.id}
                                label={`#${o.id.slice(-6)}`}
                                deleteAction={deleteOrder}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}