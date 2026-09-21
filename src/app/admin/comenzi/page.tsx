import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import type { OrderStatus, Prisma } from "@prisma/client";
import {getPrisma} from "@/lib/db";
import DeleteOrderButton from "@/components/DeleteOrderButton";
import PaymentBadge from "@/components/PaymentBadge";
import StatusChip from "@/components/admin/StatusChip";
import Icon from "@/components/Icon";
import { ORDER_STATUS, ORDER_STATUS_ORDER, formatRon } from "@/lib/hive";

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

const PAYMENT_FILTERS = {
    "card-neplatit": {
        label: "Card neplătit",
        where: {
            paymentMethod: "CARD",
            paymentStatus: { not: "PAID" },
            status: { notIn: ["CANCELLED", "DELIVERED"] },
        },
    },
    "ramburs-deschis": {
        label: "Ramburs de încasat",
        where: { paymentMethod: "CASH_ON_DELIVERY", status: { in: ["CONFIRMED", "SHIPPED"] } },
    },
} satisfies Record<string, { label: string; where: Prisma.OrderWhereInput }>;

type PaymentFilter = keyof typeof PAYMENT_FILTERS;

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; plata?: string }>;
}) {
    const prisma = getPrisma();
    const session = await getServerSession(authOptions);
    if (!session || (session as any).role !== "ADMIN") {
        redirect("/admin/login");
    }

    const params = await searchParams;
    const status = ORDER_STATUS_ORDER.includes(params.status as OrderStatus)
        ? (params.status as OrderStatus)
        : undefined;
    const plata = params.plata && params.plata in PAYMENT_FILTERS ? (params.plata as PaymentFilter) : undefined;

    const where: Prisma.OrderWhereInput = plata ? PAYMENT_FILTERS[plata].where : status ? { status } : {};

    const [orders, counts] = await Promise.all([
        prisma.order.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                user: true,
                items: true,
            },
        }),
        prisma.order.groupBy({ by: ["status"], _count: true }),
    ]);

    const countBy = Object.fromEntries(counts.map((c) => [c.status, c._count])) as Partial<Record<OrderStatus, number>>;
    const total = counts.reduce((s, c) => s + c._count, 0);

    const dateFmt = new Intl.DateTimeFormat("ro-RO", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Bucharest",
    });

    const tabs = [
        { key: "all", label: "Toate", href: "/admin/comenzi", count: total, active: !status && !plata },
        ...ORDER_STATUS_ORDER.map((s) => ({
            key: s,
            label: ORDER_STATUS[s].label,
            href: `/admin/comenzi?status=${s}`,
            count: countBy[s] ?? 0,
            active: status === s && !plata,
        })),
    ];

    return (
        <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
            <h1 className="text-3xl font-extrabold md:text-4xl">Comenzi</h1>

            <nav aria-label="Filtrează după status" className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4">
                {tabs.map((t) => (
                    <Link
                        key={t.key}
                        href={t.href}
                        aria-current={t.active ? "page" : undefined}
                        className={`inline-flex shrink-0 items-center gap-2 rounded-full border-[1.5px] px-3.5 py-1.5 text-[0.92rem] font-bold transition-colors ${
                            t.active
                                ? "border-ink bg-ink text-wash"
                                : "border-rule-strong bg-paper text-ink-2 hover:border-ink"
                        }`}
                    >
                        {t.label}
                        <span className={`tabular-nums ${t.active ? "text-hive-sun" : "text-ink-3"}`}>{t.count}</span>
                    </Link>
                ))}
            </nav>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.9rem]">
                <span className="text-ink-3">Plată:</span>
                {(Object.keys(PAYMENT_FILTERS) as PaymentFilter[]).map((k) => (
                    <Link
                        key={k}
                        href={plata === k ? "/admin/comenzi" : `/admin/comenzi?plata=${k}`}
                        aria-current={plata === k ? "page" : undefined}
                        className={`rounded-md px-2 py-1 font-bold ${
                            plata === k ? "bg-hive-blue text-white" : "text-hive-blue hover:bg-hive-blue/10"
                        }`}
                    >
                        {PAYMENT_FILTERS[k].label}
                        {plata === k ? " ×" : ""}
                    </Link>
                ))}
            </div>

            <div className="sheet mt-5 overflow-hidden">
                {orders.length === 0 ? (
                    <div className="px-4 py-14 text-center">
                        <p className="font-bold">Nicio comandă aici.</p>
                        <p className="mt-1 text-ink-3">
                            {status || plata ? "Schimbă filtrul ca să vezi alte comenzi." : "Comenzile noi apar aici imediat."}
                        </p>
                    </div>
                ) : (
                    <table className="w-full text-left text-[0.95rem]">
                        <thead className="hidden border-b border-rule bg-wash text-[0.8rem] font-bold text-ink-3 md:table-header-group">
                            <tr>
                                <th scope="col" className="px-4 py-2.5 font-bold">Comanda</th>
                                <th scope="col" className="px-4 py-2.5 font-bold">Client</th>
                                <th scope="col" className="px-4 py-2.5 font-bold">Livrare</th>
                                <th scope="col" className="px-4 py-2.5 font-bold">Status</th>
                                <th scope="col" className="px-4 py-2.5 text-right font-bold">Total</th>
                                <th scope="col" className="w-12 px-2 py-2.5"><span className="sr-only">Acțiuni</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-rule">
                            {orders.map((o) => {
                                const qty = o.items.reduce((s, i) => s + i.qty, 0);
                                return (
                                    <tr key={o.id} className="relative grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 px-4 py-3.5 hover:bg-wash md:table-row md:p-0">
                                        <td className="md:px-4 md:py-3 md:align-top">
                                            <Link
                                                href={`/admin/comenzi/${o.id}`}
                                                className="font-bold text-hive-blue after:absolute after:inset-0 after:content-[''] hover:underline md:after:hidden"
                                            >
                                                #{o.id.slice(-6)}
                                            </Link>
                                            <span className="block text-[0.85rem] text-ink-3">{dateFmt.format(o.createdAt)}</span>
                                        </td>
                                        <td className="col-span-2 row-start-2 min-w-0 md:px-4 md:py-3 md:align-top">
                                            <Link href={`/admin/comenzi/${o.id}`} className="block truncate font-bold md:hover:underline">
                                                {o.fullName ?? "—"}
                                            </Link>
                                            <span className="block truncate text-[0.85rem] text-ink-3">
                                                {o.phone ?? o.email}
                                                {o.user ? "" : " · fără cont"}
                                            </span>
                                        </td>
                                        <td className="col-span-2 row-start-3 text-[0.9rem] text-ink-2 md:px-4 md:py-3 md:align-top">
                                            <span className="inline-flex items-center gap-1.5">
                                                <Icon
                                                    name={o.deliveryMethod === "EASYBOX" ? "box" : "truck"}
                                                    size={16}
                                                    className="text-ink-3"
                                                />
                                                {o.deliveryMethod === "EASYBOX"
                                                    ? o.easyboxName ?? "easybox nespecificat"
                                                    : [o.city, o.county].filter(Boolean).join(", ") || "la adresă"}
                                            </span>
                                            <span className="block text-[0.85rem] text-ink-3">{qty} {qty === 1 ? "borcan" : "borcane"}</span>
                                        </td>
                                        <td className="col-span-2 row-start-4 md:px-4 md:py-3 md:align-top">
                                            <span className="flex flex-wrap items-center gap-1.5">
                                                <StatusChip status={o.status} />
                                                <PaymentBadge method={o.paymentMethod} status={o.paymentStatus} />
                                            </span>
                                            {o.phoneConfirmed ? (
                                                <span className="mt-1 flex items-center gap-1 text-[0.8rem] text-hive-leaf">
                                                    <Icon name="check" size={14} />
                                                    confirmat telefonic
                                                </span>
                                            ) : null}
                                        </td>
                                        <td className="col-start-2 row-start-1 text-right font-bold tabular-nums md:px-4 md:py-3 md:align-top">
                                            {formatRon(o.totalRon)}
                                        </td>
                                        <td className="absolute bottom-3 right-3 z-10 md:static md:px-2 md:py-2.5 md:align-top">
                                            <DeleteOrderButton
                                                orderId={o.id}
                                                label={`#${o.id.slice(-6)}`}
                                                deleteAction={deleteOrder}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </main>
    );
}
