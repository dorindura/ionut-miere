import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";
import { getPrisma } from "@/lib/db";
import Icon from "@/components/Icon";
import StatusChip from "@/components/admin/StatusChip";
import PaymentBadge from "@/components/PaymentBadge";
import { formatRon, hiveStyle } from "@/lib/hive";

export const dynamic = "force-dynamic";

function Counter({
    href,
    label,
    value,
    hint,
    paint,
    fg,
}: {
    href: string;
    label: string;
    value: string;
    hint: string;
    paint: string;
    fg: string;
}) {
    // un stup mic: capac, corp vopsit, numărul pe plăcuța ștanțată
    return (
        <Link href={href} className="hive hive-link group flex h-full" style={hiveStyle({ paint, fg })}>
            <span className="hive-lid !mx-[-0.3rem] !h-2.5" aria-hidden />
            <span className="hive-body !px-3.5 !pb-3.5 !pt-3">
                <span className="text-[0.95rem] font-bold leading-tight">{label}</span>
                <span className="plate mt-2.5 self-start !px-2.5 !py-1 !text-[2rem] !leading-none">{value}</span>
                <span className="mt-2.5 flex items-center justify-between gap-2 text-[0.85rem] opacity-90">
                    {hint}
                    <Icon name="arrowRight" size={16} className="transition-transform group-hover:translate-x-0.5" />
                </span>
            </span>
        </Link>
    );
}

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    if (!session || (session as any).role !== "ADMIN") {
        redirect("/admin/login");
    }

    const prisma = getPrisma();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [pending, pendingToday, confirmed, unpaidCard, codOpen, recent, soldOut] = await Promise.all([
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.order.count({ where: { status: "PENDING", createdAt: { gte: startOfDay } } }),
        prisma.order.count({ where: { status: "CONFIRMED" } }),
        prisma.order.count({
            where: {
                paymentMethod: "CARD",
                paymentStatus: { not: "PAID" },
                status: { notIn: ["CANCELLED", "DELIVERED"] },
            },
        }),
        prisma.order.aggregate({
            where: { paymentMethod: "CASH_ON_DELIVERY", status: { in: ["CONFIRMED", "SHIPPED"] } },
            _sum: { totalRon: true },
            _count: true,
        }),
        prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            take: 6,
            select: {
                id: true,
                createdAt: true,
                fullName: true,
                email: true,
                totalRon: true,
                status: true,
                paymentMethod: true,
                paymentStatus: true,
            },
        }),
        prisma.product.findMany({ where: { inStock: false }, select: { id: true, name: true, weight: true } }),
    ]);

    const dateFmt = new Intl.DateTimeFormat("ro-RO", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Bucharest",
    });

    return (
        <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold md:text-4xl">Panou</h1>
                    <p className="mt-1 text-ink-3">Ce e de făcut azi, în ordinea în care se face.</p>
                </div>
                <Link href="/admin/produse/nou" className="btn btn-ghost btn-sm bg-paper">
                    <Icon name="plus" size={18} />
                    Produs nou
                </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <Counter
                    href="/admin/comenzi?status=PENDING"
                    label="De confirmat telefonic"
                    value={String(pending)}
                    hint={pendingToday > 0 ? `${pendingToday} azi` : "comenzi noi"}
                    paint="var(--color-hive-orange)"
                    fg="#1c2a21"
                />
                <Counter
                    href="/admin/comenzi?status=CONFIRMED"
                    label="De expediat"
                    value={String(confirmed)}
                    hint="confirmate, gata de trimis"
                    paint="var(--color-hive-blue)"
                    fg="#ffffff"
                />
                <Counter
                    href="/admin/comenzi?plata=card-neplatit"
                    label="Card neplătit"
                    value={String(unpaidCard)}
                    hint="nu expedia încă"
                    paint="var(--color-hive-red)"
                    fg="#ffffff"
                />
                <Counter
                    href="/admin/comenzi?plata=ramburs-deschis"
                    label="Ramburs de încasat"
                    value={formatRon(codOpen._sum.totalRon ?? 0)}
                    hint={`${codOpen._count} comenzi în curs`}
                    paint="var(--color-hive-sun)"
                    fg="#1c2a21"
                />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <section className="sheet lg:col-span-2" aria-labelledby="ultimele">
                    <div className="flex items-center justify-between border-b border-rule px-4 py-3">
                        <h2 id="ultimele" className="text-lg font-bold">Ultimele comenzi</h2>
                        <Link href="/admin/comenzi" className="text-[0.9rem] font-bold text-hive-blue hover:underline">
                            Toate comenzile
                        </Link>
                    </div>
                    {recent.length === 0 ? (
                        <p className="px-4 py-10 text-center text-ink-3">Nicio comandă încă.</p>
                    ) : (
                        <ul className="divide-y divide-rule">
                            {recent.map((o) => (
                                <li key={o.id}>
                                    <Link
                                        href={`/admin/comenzi/${o.id}`}
                                        className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 px-4 py-3 hover:bg-wash sm:grid-cols-[5.5rem_1fr_auto_auto]"
                                    >
                                        <span className="hidden font-bold tabular-nums text-hive-blue sm:inline">#{o.id.slice(-6)}</span>
                                        <span className="min-w-0">
                                            <span className="block truncate font-bold">{o.fullName ?? o.email}</span>
                                            <span className="block text-[0.85rem] text-ink-3">{dateFmt.format(o.createdAt)}</span>
                                        </span>
                                        <span className="flex flex-wrap gap-1.5">
                                            <StatusChip status={o.status} />
                                            <PaymentBadge method={o.paymentMethod} status={o.paymentStatus} />
                                        </span>
                                        <span className="col-start-2 row-start-1 text-right font-bold tabular-nums sm:col-start-auto sm:row-start-auto">
                                            {formatRon(o.totalRon)}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="sheet self-start" aria-labelledby="stoc">
                    <div className="border-b border-rule px-4 py-3">
                        <h2 id="stoc" className="text-lg font-bold">Stoc</h2>
                    </div>
                    {soldOut.length === 0 ? (
                        <p className="flex items-center gap-2 px-4 py-4 text-ink-2">
                            <Icon name="check" size={18} className="text-hive-leaf" />
                            Toate produsele sunt în stoc.
                        </p>
                    ) : (
                        <ul className="divide-y divide-rule">
                            {soldOut.map((p) => (
                                <li key={p.id}>
                                    <Link
                                        href={`/admin/produse/${p.id}`}
                                        className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-wash"
                                    >
                                        <span>
                                            <span className="block font-bold">{p.name}</span>
                                            <span className="text-[0.85rem] text-ink-3">{p.weight} · stoc epuizat</span>
                                        </span>
                                        <Icon name="edit" size={18} className="text-ink-3" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
}
