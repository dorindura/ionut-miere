import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";

type OrderWithRelations = Prisma.OrderGetPayload<{
    include: { user: true; items: true };
}>;

export default async function AdminOrderPage({
                                                 params,
                                             }: {
    params: { id: string };
}) {
    const session = await getServerSession(authOptions);
    if (!session || (session as any).role !== "ADMIN") {
        redirect("/admin/login");
    }

    const order: OrderWithRelations | null = await prisma.order.findUnique({
        where: { id: params.id },
        include: { user: true, items: true },
    });

    if (!order) return notFound();

    async function updateOrder(formData: FormData) {
        "use server";

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
    }

    return (
        <main className="mx-auto max-w-4xl px-4 py-12">
            <h1 className="text-3xl font-black">
                Comandă #{order.id.slice(-6)}
            </h1>

            <div className="mt-6 space-y-3">
                <p>Email client: {order.user.email}</p>
                <p>Total: {order.totalRon} RON</p>
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