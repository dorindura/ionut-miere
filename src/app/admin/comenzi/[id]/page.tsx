import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import {getPrisma} from "@/lib/db";
import { revalidatePath } from "next/cache";
import { paymentLabel } from "@/components/PaymentBadge";
import StatusChip from "@/components/admin/StatusChip";
import Icon from "@/components/Icon";
import { ORDER_STATUS, ORDER_STATUS_ORDER, formatRon } from "@/lib/hive";

type OrderWithRelations = Prisma.OrderGetPayload<{
    include: { user: true; items: true };
}>;

export const dynamic = "force-dynamic";

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
    return (
        <section className="sheet">
            <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-3">
                <h2 className="text-lg font-bold">{title}</h2>
                {action}
            </div>
            <div className="px-4 py-4">{children}</div>
        </section>
    );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-[7.5rem_1fr] gap-3 py-1.5">
            <dt className="text-ink-3">{label}</dt>
            <dd className="min-w-0 break-words font-semibold">{children}</dd>
        </div>
    );
}

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

    const dateFmt = new Intl.DateTimeFormat("ro-RO", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "Europe/Bucharest",
    });

    async function updateOrder(formData: FormData) {
        "use server";

        // server action = endpoint public -> verificăm rolul admin aici
        const session = await getServerSession(authOptions);
        if (!session || (session as any).role !== "ADMIN") {
            redirect("/admin/login");
        }

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

        // navigare nouă -> pagina se re-randează cu datele actualizate
        // (altfel router cache-ul client afișează datele dinainte de update)
        redirect(`/admin/comenzi/${orderId}`);
    }

    const subtotal = order.items.reduce((s, i) => s + i.priceRon * i.qty, 0);
    const phoneHref = order.phone ? `tel:${order.phone.replace(/[^\d+]/g, "")}` : null;

    return (
        <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
            <Link href="/admin/comenzi" className="inline-flex items-center gap-1.5 py-1 font-bold text-ink-2 hover:text-ink">
                <Icon name="arrowLeft" size={18} />
                Comenzi
            </Link>

            <div className="mt-3 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-extrabold md:text-4xl">Comanda #{order.id.slice(-6)}</h1>
                <StatusChip status={order.status} />
            </div>
            <p className="mt-1 text-ink-3">Plasată {dateFmt.format(order.createdAt)}</p>

            {/* plata: informația care nu are voie să fie citită greșit */}
            <div className="mt-6">
                {order.paymentMethod === "CARD" ? (
                    order.paymentStatus === "PAID" ? (
                        <div className="flex items-start gap-3 rounded-xl bg-hive-leaf px-5 py-4 text-white">
                            <Icon name="check" size={26} className="mt-0.5" />
                            <div>
                                <p className="text-lg font-extrabold">Plătită online cu cardul — NU pune ramburs la AWB</p>
                                <p className="mt-1 text-[0.95rem] text-white/90">
                                    Easybox / curier: valoare ramburs 0 lei.
                                    {order.paidAt ? ` Plătită: ${dateFmt.format(order.paidAt)}.` : ""}
                                </p>
                                {order.netopiaNtpId ? (
                                    <p className="mt-1 text-[0.85rem] text-white/80">
                                        ID tranzacție NETOPIA: {order.netopiaNtpId}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start gap-3 rounded-xl bg-hive-red px-5 py-4 text-white">
                            <Icon name="alert" size={26} className="mt-0.5" />
                            <div>
                                <p className="text-lg font-extrabold">
                                    Comandă cu cardul NEPLĂTITĂ ({paymentLabel(order.paymentMethod, order.paymentStatus).label})
                                </p>
                                <p className="mt-1 text-[0.95rem] text-white/90">Nu expedia până nu apare plata confirmată.</p>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="flex items-start gap-3 rounded-xl bg-hive-sun px-5 py-4 text-ink">
                        <Icon name="cash" size={26} className="mt-0.5" />
                        <div>
                            <p className="text-lg font-extrabold">
                                Ramburs — încasează <span className="tabular-nums">{formatRon(order.totalRon)}</span> la livrare
                            </p>
                            <p className="mt-1 text-[0.95rem]">
                                Setează rambursul la AWB.
                                {order.deliveryMethod === "EASYBOX"
                                    ? " La easybox clientul plătește rambursul doar cu cardul, la locker."
                                    : ""}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-12">
                <div className="grid gap-6 lg:col-span-7 lg:self-start">
                    <Section
                        title="Client"
                        action={
                            phoneHref ? (
                                <a href={phoneHref} className="btn btn-ink btn-sm">
                                    <Icon name="phone" size={16} />
                                    Sună
                                </a>
                            ) : null
                        }
                    >
                        <dl>
                            <Row label="Nume">{order.fullName ?? "—"}</Row>
                            <Row label="Telefon">
                                {phoneHref ? (
                                    <a href={phoneHref} className="tabular-nums text-hive-blue underline">
                                        {order.phone}
                                    </a>
                                ) : (
                                    "—"
                                )}
                            </Row>
                            <Row label="Email">
                                <a href={`mailto:${order.email}`} className="text-hive-blue underline">
                                    {order.email}
                                </a>
                            </Row>
                            <Row label="Cont">{order.user ? order.user.email : "fără cont (guest)"}</Row>
                        </dl>
                    </Section>

                    <Section title={order.deliveryMethod === "EASYBOX" ? "Livrare la easybox" : "Livrare la adresă"}>
                        {order.deliveryMethod === "EASYBOX" ? (
                            <dl>
                                <Row label="Easybox">{order.easyboxName ?? "—"}</Row>
                                <Row label="Adresă">{order.easyboxAddress ?? "—"}</Row>
                                <Row label="Localitate">
                                    {[order.easyboxCity, order.easyboxCounty, order.easyboxPostalCode]
                                        .filter(Boolean)
                                        .join(", ") || "—"}
                                </Row>
                                <Row label="ID easybox">{order.easyboxId ?? "—"}</Row>
                                <Row label="Taxă livrare">{formatRon(order.shippingRon)}</Row>
                            </dl>
                        ) : (
                            <dl>
                                <Row label="Adresă">{order.address ?? "—"}</Row>
                                <Row label="Localitate">
                                    {[order.city, order.county, order.postalCode].filter(Boolean).join(", ") || "—"}
                                </Row>
                                <Row label="Taxă livrare">{formatRon(order.shippingRon)}</Row>
                            </dl>
                        )}
                    </Section>

                    <Section title="Produse">
                        <table className="w-full text-[0.95rem]">
                            <thead className="sr-only">
                                <tr>
                                    <th>Produs</th>
                                    <th>Cantitate</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-rule">
                                {order.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="py-2.5 pr-3">
                                            <span className="block font-bold">{item.name}</span>
                                            <span className="text-[0.85rem] text-ink-3">
                                                {item.weight} · {formatRon(item.priceRon)} / buc.
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap py-2.5 pr-3 text-right tabular-nums">× {item.qty}</td>
                                        <td className="whitespace-nowrap py-2.5 text-right font-bold tabular-nums">
                                            {formatRon(item.priceRon * item.qty)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="border-t-2 border-ink text-[0.95rem]">
                                <tr>
                                    <td colSpan={2} className="pt-3 text-ink-3">Subtotal produse</td>
                                    <td className="pt-3 text-right tabular-nums">{formatRon(subtotal)}</td>
                                </tr>
                                <tr>
                                    <td colSpan={2} className="py-1 text-ink-3">Livrare</td>
                                    <td className="py-1 text-right tabular-nums">{formatRon(order.shippingRon)}</td>
                                </tr>
                                <tr>
                                    <td colSpan={2} className="pt-1 text-lg font-extrabold">Total</td>
                                    <td className="pt-1 text-right text-lg font-extrabold tabular-nums">{formatRon(order.totalRon)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </Section>
                </div>

                <form
                    key={order.updatedAt.getTime()}
                    action={updateOrder}
                    className="sheet grid gap-5 p-4 lg:sticky lg:top-20 lg:col-span-5 lg:self-start"
                >
                    <input type="hidden" name="orderId" value={order.id} />
                    <h2 className="text-lg font-bold">Actualizează comanda</h2>

                    <fieldset>
                        <legend className="mb-2 text-[0.95rem] font-bold">Status</legend>
                        <div className="grid grid-cols-2 gap-2">
                            {ORDER_STATUS_ORDER.map((s) => (
                                <label
                                    key={s}
                                    className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border-[1.5px] border-rule-strong px-3 py-2 font-bold has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-wash has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-hive-blue"
                                >
                                    <input
                                        type="radio"
                                        name="status"
                                        value={s}
                                        defaultChecked={order.status === s}
                                        className="sr-only"
                                    />
                                    {ORDER_STATUS[s].label}
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg bg-wash px-3 py-2.5 font-bold">
                        <input
                            type="checkbox"
                            name="phoneConfirmed"
                            defaultChecked={order.phoneConfirmed}
                            className="h-5 w-5"
                        />
                        <span>
                            Confirmată telefonic
                            {order.phoneConfirmedAt ? (
                                <span className="block text-[0.85rem] font-normal text-ink-3">
                                    {dateFmt.format(order.phoneConfirmedAt)}
                                </span>
                            ) : null}
                        </span>
                    </label>

                    <label className="label">
                        Notițe interne
                        <textarea
                            name="adminNotes"
                            defaultValue={order.adminNotes ?? ""}
                            placeholder="ex. sună după ora 17, AWB 123…"
                            className="field"
                        />
                    </label>

                    <button type="submit" className="btn btn-primary text-base">
                        Salvează
                    </button>
                </form>
            </div>
        </main>
    );
}
