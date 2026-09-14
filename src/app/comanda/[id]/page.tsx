import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPrisma } from "@/lib/db";
import { refreshCardPaymentStatus } from "@/lib/orders";
import { EASYBOX_CARD_ONLY_NOTE } from "@/lib/shipping";

export const dynamic = "force-dynamic";

export default async function OrderPlacedPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ plata?: string }>;
}) {
    const { id } = await params;
    const { plata } = await searchParams;
    const prisma = getPrisma();
    const session = await getServerSession(authOptions);
    const isLoggedIn = !!session?.user?.email;

    // clientul se poate întoarce de la NETOPIA înaintea IPN-ului -> verificăm statusul direct
    await refreshCardPaymentStatus(id);

    const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
    });

    if (!order) return notFound();

    const isCard = order.paymentMethod === "CARD";
    const isPaid = order.paymentStatus === "PAID";
    const isPending = isCard && order.paymentStatus === "PENDING";
    const canPay = isCard && ["PENDING", "FAILED", "CANCELLED"].includes(order.paymentStatus);

    const title = !isCard
        ? "Comandă plasată ✅"
        : isPaid
          ? "Plată confirmată ✅"
          : isPending
            ? "Plata se procesează…"
            : order.paymentStatus === "REFUNDED"
              ? "Plată rambursată"
              : "Plata nu a fost finalizată";

    return (
        <main className="mx-auto max-w-3xl px-4 py-12">
            <h1 className="text-3xl font-black">{title}</h1>
            <p className="mt-2 text-neutral-300">
                ID comandă: <span className="text-yellow-300 font-semibold">{order.id}</span>
            </p>

            {canPay ? (
                <div className="mt-6 rounded-3xl border border-red-500/25 bg-red-500/5 p-6 text-sm text-neutral-200">
                    <p>
                        {isPending
                            ? "Dacă ai finalizat plata, confirmarea apare în câteva momente. Dacă ai închis pagina de plată, o poți relua."
                            : plata === "eroare"
                              ? "Nu am putut porni plata cu cardul. Încearcă din nou în câteva momente."
                              : "Plata cu cardul nu a fost finalizată. Poți încerca din nou."}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <form action="/api/netopia/plateste" method="POST">
                            <input type="hidden" name="orderId" value={order.id} />
                            <button
                                type="submit"
                                className="rounded-xl bg-yellow-500 px-6 py-3 text-sm font-semibold text-neutral-950 hover:bg-yellow-400"
                            >
                                {isPending ? "Reia plata cu cardul" : "Plătește cu cardul"}
                            </button>
                        </form>
                        {isPending ? (
                            <a
                                href={`/comanda/${order.id}`}
                                className="rounded-xl border border-yellow-500/25 px-6 py-3 text-sm font-semibold hover:border-yellow-400/60"
                            >
                                Reîncarcă statusul
                            </a>
                        ) : null}
                    </div>
                </div>
            ) : null}

            <div className="mt-8 rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6">
                <h2 className="text-xl font-black">Sumar</h2>
                <div className="mt-4 grid gap-2">
                    {order.items.map((it) => (
                        <div key={it.id} className="flex justify-between gap-4 text-sm">
              <span className="text-neutral-200">
                {it.name} ({it.weight}) • {it.qty} buc
              </span>
                            <span className="text-yellow-300 font-semibold">{it.qty * it.priceRon} RON</span>
                        </div>
                    ))}
                </div>

                <div className="mt-6 grid gap-2 border-t border-yellow-500/10 pt-4">
                    <div className="flex justify-between gap-4 text-sm">
                        <span className="text-neutral-300">Livrare</span>
                        <span className="text-neutral-200 font-semibold">
                            {order.deliveryMethod === "EASYBOX" ? "easybox" : "la adresă"} • {order.shippingRon} RON
                        </span>
                    </div>

                    <div className="flex justify-between gap-4 text-sm">
                        <span className="text-neutral-300">Plată</span>
                        <span className="text-neutral-200 font-semibold">
                            {!isCard ? "ramburs la livrare" : isPaid ? "card online (plătită)" : "card online (neplătită)"}
                        </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between border-t border-yellow-500/10 pt-3">
                        <span className="text-neutral-300">Total</span>
                        <span className="text-2xl font-black text-yellow-300">{order.totalRon} RON</span>
                    </div>
                </div>

                <p className="mt-3 text-xs text-neutral-400">
                    {!isCard
                        ? "Plată ramburs la livrare. Te contactăm pentru confirmare."
                        : isPaid
                          ? "Plătită online cu cardul. Nu mai ai nimic de plătit la livrare."
                          : "Comanda va fi pregătită după confirmarea plății."}
                    {order.email && (!isCard || isPaid)
                        ? ` Am trimis un email de confirmare la ${order.email}.`
                        : ""}
                </p>

                {!isCard && order.deliveryMethod === "EASYBOX" ? (
                    <p className="mt-3 rounded-xl border border-yellow-400/40 bg-yellow-500/10 px-3 py-2 text-xs font-semibold text-yellow-200">
                        ⚠️ {EASYBOX_CARD_ONLY_NOTE}
                    </p>
                ) : null}
            </div>

            <div className="mt-8 flex gap-3">
                <Link
                    href="/magazin"
                    className="rounded-xl bg-yellow-500 px-6 py-3 text-sm font-semibold text-neutral-950 hover:bg-yellow-400"
                >
                    Înapoi la magazin
                </Link>
                {isLoggedIn ? (
                    <Link
                        href="/cont/comenzi"
                        className="rounded-xl border border-yellow-500/25 px-6 py-3 text-sm font-semibold hover:border-yellow-400/60"
                    >
                        Comenzile mele
                    </Link>
                ) : null}
            </div>
        </main>
    );
}
