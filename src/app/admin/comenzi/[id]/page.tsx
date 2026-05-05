import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect, notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import {getPrisma} from "@/lib/db";
import { revalidatePath } from "next/cache";

type OrderWithRelations = Prisma.OrderGetPayload<{
    include: { user: true; items: true };
}>;

export const dynamic = "force-dynamic";

export default async function AdminOrderPage({
                                                 params,
                                             }: {
    params: Promise<{ id: string }>;
}) {
    const prisma = getPrisma();
    const session = await getServerSession(authOptions);

    if (!session || (session as any).role !== "ADMIN") {
        redirect("/admin/login");
    }

    const { id } = await params;

    const order: OrderWithRelations | null = await prisma.order.findUnique({
        where: { id },
        include: { user: true, items: true },
    });

    if (!order) return notFound();

    async function updateOrder(formData: FormData) {
        "use server";

        const prisma = getPrisma();

        const orderId = String(formData.get("orderId") || "");
        if (!orderId) return;

        const status = String(formData.get("status") || "PENDING");
        const phoneConfirmed = String(formData.get("phoneConfirmed")) === "on";
        const adminNotes = String(formData.get("adminNotes") || "");

        await prisma.order.update({
            where: { id: orderId },
            data: {
                status: status as any,
                phoneConfirmed,
                phoneConfirmedAt: phoneConfirmed ? new Date() : null,
                adminNotes: adminNotes || null,
            },
        });

        revalidatePath(`/admin/comenzi/${orderId}`);
        revalidatePath("/admin/comenzi");
    }

    return (
        <main className="mx-auto max-w-4xl px-4 py-12">
            <h1 className="text-3xl font-black">
                Comandă #{order.id.slice(-6)}
            </h1>

            <div className="mt-6 space-y-3">
                <p>Email client: {order.user.email}</p>
                <p>Total: {order.totalRon} RON</p>
                <div className="rounded-2xl border border-yellow-500/15 bg-neutral-900/30 p-4">
                    <p className="font-semibold text-yellow-300">Livrare</p>

                    {order.deliveryMethod === "EASYBOX" ? (
                        <div className="mt-2 text-sm text-neutral-300">
                            <p>Metodă: easybox</p>
                            <p>Easybox: {order.easyboxName}</p>
                            <p>Adresă: {order.easyboxAddress}</p>
                            <p>
                                {[order.easyboxCity, order.easyboxCounty, order.easyboxPostalCode]
                                    .filter(Boolean)
                                    .join(", ")}
                            </p>
                            <p>ID easybox: {order.easyboxId}</p>
                        </div>
                    ) : (
                        <div className="mt-2 text-sm text-neutral-300">
                            <p>Metodă: livrare la adresă</p>
                            <p>Adresă: {order.address}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 space-y-4">
                {order.items.map((item) => (
                    <div key={item.id} className="border p-3 rounded-xl">
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-sm text-neutral-300">
                            {item.weight} • {item.priceRon} RON • x {item.qty}
                        </div>
                        <div className="text-xs text-neutral-500">ProductId: {item.productId}</div>
                    </div>
                ))}
            </div>

            <form
                action={updateOrder}
                className="mt-10 space-y-4 rounded-2xl border border-yellow-500/15 p-6"
            >
                <input type="hidden" name="orderId" value={order.id} />
                <label className="block">
                    Status:
                    <select
                        name="status"
                        defaultValue={order.status}
                        className="mt-1 w-full rounded-xl bg-neutral-900 p-2"
                    >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                    </select>
                </label>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="phoneConfirmed"
                        defaultChecked={order.phoneConfirmed}
                    />
                    Confirmare telefonică
                </label>

                <label className="block">
                    Notițe admin:
                    <textarea
                        name="adminNotes"
                        defaultValue={order.adminNotes ?? ""}
                        className="mt-1 w-full rounded-xl bg-neutral-900 p-3"
                    />
                </label>

                <button
                    type="submit"
                    className="rounded-xl bg-yellow-500 px-4 py-2 font-semibold text-neutral-950"
                >
                    Salvează
                </button>
            </form>
        </main>
    );
}