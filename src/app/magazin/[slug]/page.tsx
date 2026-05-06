import ImageSlider from "@/components/ImageSlider";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import Link from "next/link";
import {getPrisma} from "@/lib/db";

export default async function ProductPage({
                                              params,
                                          }: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const prisma = getPrisma();

    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            images: {
                orderBy: {
                    sortOrder: "asc",
                },
            },
        },
    });

    if (!product) return notFound();

    const p = {
        ...product,
        images: product.images.map((x) => x.url),
        details: {
            origin: product.origin ?? undefined,
            howItsMade: product.howItsMade ?? undefined,
            characteristics: Array.isArray(product.characteristics)
                ? product.characteristics.map(String)
                : [],
            benefits: Array.isArray(product.benefits)
                ? product.benefits.map(String)
                : [],
            consumption: Array.isArray(product.consumption)
                ? product.consumption.map(String)
                : [],
        },
    };

    return (
        <main className="mx-auto max-w-6xl px-4 py-12">
            <div className="grid gap-8 md:grid-cols-2">
                <ImageSlider images={p.images} alt={`${p.name} ${p.weight}`} />

                <div className="rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6">
                    <h1 className="text-3xl font-black">{p.name}</h1>
                    <p className="mt-2 text-neutral-300">{p.shortDescription}</p>

                    <div className="mt-6 flex items-center justify-between rounded-2xl border border-yellow-500/15 bg-neutral-950/40 p-4">
                        <div>
                            <p className="text-sm text-neutral-300">Preț</p>
                            <p className="text-xl font-black text-yellow-300">
                                {p.priceRon ? `${p.priceRon} RON` : "—"}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-neutral-300">Gramaj</p>
                            <p className="font-semibold">{p.weight}</p>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <AddToCartButton slug={slug} />
                        <Link
                            href="/cos"
                            className="rounded-xl border border-yellow-500/25 px-5 py-3 text-sm font-semibold hover:border-yellow-400/60 text-center"
                        >
                            Vezi coșul
                        </Link>
                        <Link
                            href="/magazin"
                            className="rounded-xl border border-yellow-500/25 px-5 py-3 text-sm font-semibold hover:border-yellow-400/60"
                        >
                            Înapoi la magazin
                        </Link>
                    </div>
                </div>
            </div>

            {/* INFORMAȚII STRUCTURATE */}
            <section className="mt-10 grid gap-4 md:grid-cols-2">
                {p.details?.origin && (
                    <article className="rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6">
                        <h2 className="text-xl font-black text-yellow-200">Origine</h2>
                        <p className="mt-2 text-sm text-neutral-300 leading-relaxed">{p.details.origin}</p>
                    </article>
                )}

                {p.details?.howItsMade && (
                    <article className="rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6">
                        <h2 className="text-xl font-black text-yellow-200">Cum se formează</h2>
                        <p className="mt-2 text-sm text-neutral-300 leading-relaxed">{p.details.howItsMade}</p>
                    </article>
                )}

                <article className="rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6">
                    <h2 className="text-xl font-black text-yellow-200">Caracteristici</h2>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-300">
                        {p.details.characteristics.map((x) => (
                            <li key={x}>{x}</li>
                        ))}
                    </ul>
                </article>

                <article className="rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6">
                    <h2 className="text-xl font-black text-yellow-200">Beneficii</h2>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-300">
                        {p.details.benefits.map((x) => (
                            <li key={x}>{x}</li>
                        ))}
                    </ul>
                    <p className="mt-3 text-xs text-neutral-400">
                        *Informații generale; nu înlocuiesc recomandările medicale.
                    </p>
                </article>

                <article className="rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6 md:col-span-2">
                    <h2 className="text-xl font-black text-yellow-200">Recomandare de consum</h2>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-300">
                        {p.details.consumption.map((x) => (
                            <li key={x}>{x}</li>
                        ))}
                    </ul>
                </article>
            </section>

            {/* Comentarii (placeholder UI) */}
            {/*<section className="mt-10 rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6">*/}
            {/*    <h2 className="text-xl font-black">Recenzii & comentarii</h2>*/}
            {/*    <p className="mt-2 text-sm text-neutral-300">*/}
            {/*        Următorul pas: salvare în DB + moderare în admin.*/}
            {/*    </p>*/}

            {/*    <form className="mt-5 grid gap-3 md:max-w-xl">*/}
            {/*        <input*/}
            {/*            className="rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"*/}
            {/*            placeholder="Nume"*/}
            {/*            name="name"*/}
            {/*        />*/}
            {/*        <textarea*/}
            {/*            className="min-h-[110px] rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"*/}
            {/*            placeholder="Scrie un comentariu..."*/}
            {/*            name="comment"*/}
            {/*        />*/}
            {/*        <button*/}
            {/*            type="button"*/}
            {/*            className="rounded-xl bg-yellow-500 px-5 py-3 text-sm font-semibold text-neutral-950 hover:bg-yellow-400 transition-colors"*/}
            {/*        >*/}
            {/*            Trimite (demo)*/}
            {/*        </button>*/}
            {/*    </form>*/}
            {/*</section>*/}
        </main>
    );
}