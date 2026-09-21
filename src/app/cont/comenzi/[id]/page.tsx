import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect, notFound } from "next/navigation";
import {getPrisma} from "@/lib/db";
import PaymentBadge from "@/components/PaymentBadge";

export const dynamic = "force-dynamic";

export default async function OrderDetailsPage({
                                                   params,
                                               }: {
    params: Promise<{ id: string }>;
}) {
    const session = await getServerSession(authOptions);
    const prisma = getPrisma();
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
                    <h1 className="text-3xl font-extrabold">Detalii comandă</h1>
                    <p className="mt-2 text-ink-2">
                        ID: <span className="text-ink font-semibold">{order.id}</span>
                    </p>
                </div>
                <Link
                    href="/cont/comenzi"
                    className="btn btn-ghost"
                >
                    Înapoi
                </Link>
            </div>

            <section className="mt-8 sheet p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-ink-3">Status</p>
                        <p className="text-sm font-semibold">{order.status}</p>
                        <div className="mt-1">
                            <PaymentBadge method={order.paymentMethod} status={order.paymentStatus} />
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-ink-3">Total</p>
                        <p className="text-2xl font-extrabold text-ink">{order.totalRon} lei</p>
                        <p className="text-xs text-ink-3">include {order.shippingRon} lei livrare</p>
                    </div>
                </div>

                <div className="mt-6 border-t border-rule pt-4 text-sm text-ink-2">
                    <p><span className="text-ink font-semibold">Nume:</span> {order?.fullName}</p>
                    <p><span className="text-ink font-semibold">Telefon:</span> {order?.phone}</p>
                    {order.deliveryMethod === "EASYBOX" ? (
                        <>
                            <p><span className="text-ink font-semibold">Livrare:</span> easybox ({order.shippingRon} lei)</p>
                            <p><span className="text-ink font-semibold">Easybox:</span> {order.easyboxName}</p>
                            <p><span className="text-ink font-semibold">Adresă easybox:</span> {order.easyboxAddress}</p>
                        </>
                    ) : (
                        <>
                            <p><span className="text-ink font-semibold">Livrare:</span> la adresă ({order.shippingRon} lei)</p>
                            <p><span className="text-ink font-semibold">Adresă:</span> {[order.address, order.city, order.county, order.postalCode].filter(Boolean).join(", ")}</p>
                        </>
                    )}
                </div>
            </section>

            <section className="mt-6 sheet p-6">
                <h2 className="text-xl font-extrabold">Produse</h2>

                <div className="mt-4 grid gap-3">
                    {order.items.map((it) => (
                        <div key={it.id} className="flex items-start justify-between gap-4 text-sm">
                            <div>
                                <p className="font-semibold text-ink">{it.name}</p>
                                <p className="text-ink-2">{it.weight} • {it.qty} buc • {it.priceRon} lei</p>
                            </div>
                            <p className="font-semibold text-ink">{it.qty * it.priceRon} lei</p>
                        </div>
                    ))}
                </div>
            </section>

            <p className="mt-4 text-xs text-ink-3">
                {order.paymentMethod === "CARD"
                    ? order.paymentStatus === "PAID"
                        ? "*Plătită online cu cardul."
                        : "*Plata cu cardul nu este confirmată."
                    : "*Plată ramburs la livrare."}{" "}
                Pentru modificări, contactează suportul.
            </p>
        </main>
    );
}