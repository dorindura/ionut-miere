import Link from "next/link";
import Image from "next/image";
import CartItemActions from "@/components/CartItemActions";
import Icon from "@/components/Icon";
import { getPrisma } from "@/lib/db";
import { getOrCreateCart } from "@/lib/cart";
import { hivePaint } from "@/lib/hive";
import { SHIPPING_RON } from "@/lib/shipping";

export const dynamic = "force-dynamic";

export default async function CartPage() {
    const prisma = getPrisma();
    const cart = await getOrCreateCart(false);

    const items = cart
        ? await prisma.cartItem.findMany({
              where: { cartId: cart.id },
              include: { product: { include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } } } },
              orderBy: { updatedAt: "desc" },
          })
        : [];

    const totalRon = items.reduce((sum, it) => sum + it.qty * it.product.priceRon, 0);
    const count = items.reduce((sum, it) => sum + it.qty, 0);

    return (
        <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 md:pt-12">
            <h1 className="text-[2.4rem] font-extrabold leading-none md:text-[3.2rem]">Coșul tău</h1>

            {items.length === 0 ? (
                <div className="mt-8 max-w-xl">
                    <p className="text-lg text-ink-2">Coșul este gol. Alege un sortiment din magazin — durează un minut.</p>
                    <Link href="/magazin" className="btn btn-primary mt-6 text-base">
                        Alege mierea
                        <Icon name="arrowRight" size={18} />
                    </Link>
                </div>
            ) : (
                <div className="mt-8 grid gap-8 lg:grid-cols-12">
                    <section aria-label="Produse în coș" className="lg:col-span-7">
                        <ul className="divide-y divide-rule border-y border-rule">
                            {items.map((it) => {
                                const paint = hivePaint(it.product.slug);
                                return (
                                    <li key={it.id} className="grid grid-cols-[4.5rem_1fr] gap-4 py-5 sm:grid-cols-[5.5rem_1fr_auto]">
                                        <Link
                                            href={`/magazin/${it.product.slug}`}
                                            className="relative block aspect-[4/5] overflow-hidden rounded-md border-t-[6px] bg-white"
                                            style={{ borderTopColor: paint.paint }}
                                        >
                                            {it.product.images[0]?.url ? (
                                                <Image
                                                    src={it.product.images[0].url}
                                                    alt=""
                                                    fill
                                                    sizes="88px"
                                                    className="object-contain p-1"
                                                />
                                            ) : null}
                                        </Link>
                                        <div className="min-w-0">
                                            <Link href={`/magazin/${it.product.slug}`} className="text-lg font-bold leading-tight hover:underline">
                                                {it.product.name}
                                            </Link>
                                            <p className="text-ink-3">
                                                {it.product.weight} · {it.product.priceRon} lei / buc.
                                            </p>
                                            <div className="mt-3">
                                                <CartItemActions productId={it.productId} qty={it.qty} name={it.product.name} />
                                            </div>
                                        </div>
                                        <p className="col-start-2 font-display text-xl font-extrabold tabular-nums sm:col-start-auto sm:text-right">
                                            {it.qty * it.product.priceRon} lei
                                        </p>
                                    </li>
                                );
                            })}
                        </ul>

                        <Link href="/magazin" className="mt-5 inline-flex items-center gap-1.5 font-bold text-ink-2 hover:text-ink">
                            <Icon name="arrowLeft" size={18} />
                            Continuă cumpărăturile
                        </Link>
                    </section>

                    <aside className="lg:col-span-5">
                        <div className="sheet overflow-hidden lg:sticky lg:top-24">
                            <div className="h-2 bg-hive-sun" aria-hidden />
                            <div className="p-5">
                                <h2 className="text-xl font-bold">Sumar</h2>
                                <dl className="mt-4 grid gap-2 text-[0.98rem]">
                                    <div className="flex justify-between gap-4">
                                        <dt className="text-ink-2">
                                            Produse ({count} {count === 1 ? "borcan" : "borcane"})
                                        </dt>
                                        <dd className="font-bold tabular-nums">{totalRon} lei</dd>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <dt className="text-ink-2">Livrare</dt>
                                        <dd className="text-right text-ink-2">
                                            {SHIPPING_RON.EASYBOX} lei easybox
                                            <br />
                                            {SHIPPING_RON.ADDRESS} lei curier
                                        </dd>
                                    </div>
                                </dl>
                                <div className="mt-4 flex items-end justify-between gap-4 border-t-2 border-ink pt-3">
                                    <span className="font-bold">Subtotal</span>
                                    <span className="font-display text-[2rem] font-extrabold leading-none tabular-nums">
                                        {totalRon} lei
                                    </span>
                                </div>
                                <p className="mt-2 text-[0.9rem] text-ink-3">
                                    Livrarea o alegi la pasul următor. Plata ramburs, la livrare.
                                </p>

                                <Link href="/checkout" className="btn btn-primary mt-5 w-full text-base">
                                    Finalizează comanda
                                    <Icon name="arrowRight" size={18} />
                                </Link>
                                <p className="mt-3 text-center text-[0.9rem] text-ink-3">Nu ai nevoie de cont.</p>
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </main>
    );
}
