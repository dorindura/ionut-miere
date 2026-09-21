import type { Metadata } from "next";
import ImageSlider from "@/components/ImageSlider";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import Link from "next/link";
import Icon from "@/components/Icon";
import { HiveFrame, HivePlateRow, HiveWindow } from "@/components/HiveFront";
import { getPrisma } from "@/lib/db";
import { getVarieties } from "@/lib/varieties";
import { EASYBOX_CARD_ONLY_NOTE, SHIPPING_RON } from "@/lib/shipping";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
    const prisma = getPrisma();
    return prisma.product.findUnique({
        where: { slug },
        include: {
            images: {
                orderBy: {
                    sortOrder: "asc",
                },
            },
        },
    });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);
    if (!product) return {};
    return {
        title: `${product.name} ${product.weight}`,
        description: product.shortDescription,
        openGraph: { images: product.images[0]?.url ? [product.images[0].url] : undefined },
    };
}

function DetailRow({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="grid gap-2 border-t border-rule py-7 md:grid-cols-12 md:gap-8">
            <h2 className="text-xl font-bold md:col-span-4">{title}</h2>
            <div className="max-w-[65ch] text-ink-2 md:col-span-8">{children}</div>
        </div>
    );
}

function Bullets({ items }: { items: string[] }) {
    return (
        <ul className="grid gap-2.5">
            {items.map((x) => (
                <li key={x} className="flex gap-3">
                    <span aria-hidden className="mt-[0.6em] h-1.5 w-3 shrink-0 rounded-full bg-hive-sun" />
                    <span>{x}</span>
                </li>
            ))}
        </ul>
    );
}

export default async function ProductPage({
                                              params,
                                          }: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const [product, varieties] = await Promise.all([getProduct(slug), getVarieties()]);

    if (!product) return notFound();

    const variety = varieties.find((v) => v.variants.some((x) => x.slug === slug));
    const others = varieties.filter((v) => v !== variety);

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

    const paint = variety?.paint ?? { paint: "var(--color-hive-blue)", fg: "#fff" };

    return (
        <main className="pb-20">
            <div className="mx-auto max-w-6xl px-4 pt-6">
                <Link href="/magazin" className="inline-flex items-center gap-1.5 py-2 font-bold text-ink-2 hover:text-ink">
                    <Icon name="arrowLeft" size={18} />
                    Magazin
                </Link>
            </div>

            <section className="mx-auto mt-2 grid max-w-6xl gap-8 px-4 md:grid-cols-12 md:gap-12">
                <div className="md:col-span-6 lg:col-span-5">
                    <HiveFrame paint={paint}>
                        <HivePlateRow number={variety?.number ?? 1} popular={p.popular} />
                        <ImageSlider images={p.images} alt={`${p.name}, borcan de ${p.weight}`} />
                    </HiveFrame>
                    <div className="ground-strip" aria-hidden />
                </div>

                <div className="md:col-span-6 lg:col-span-7 md:pt-4">
                    <h1 className="text-[clamp(2.3rem,5.4vw,3.8rem)] font-extrabold leading-[1]">{p.name}</h1>
                    <p className="mt-4 max-w-[52ch] text-lg text-ink-2">{p.shortDescription}</p>

                    {variety && variety.variants.length > 1 ? (
                        <div className="mt-7">
                            <p className="text-[0.9rem] font-bold">Gramaj</p>
                            <div className="mt-2 flex flex-wrap gap-2" role="list">
                                {variety.variants.map((v) => {
                                    const active = v.slug === slug;
                                    return (
                                        <Link
                                            key={v.slug}
                                            href={`/magazin/${v.slug}`}
                                            role="listitem"
                                            aria-current={active ? "page" : undefined}
                                            scroll={false}
                                            className={`flex min-h-12 min-w-28 flex-col justify-center rounded-lg border-2 px-4 py-1.5 transition-colors ${
                                                active
                                                    ? "border-ink bg-ink text-wash"
                                                    : "border-rule-strong bg-paper hover:border-ink"
                                            }`}
                                        >
                                            <span className="font-bold leading-tight">{v.weight}</span>
                                            <span className={`text-[0.85rem] leading-tight ${active ? "text-wash/80" : "text-ink-3"}`}>
                                                {v.inStock ? `${v.priceRon} lei` : "stoc epuizat"}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ) : null}

                    <div className="mt-7 flex items-end gap-3">
                        <p className="font-display text-[2.6rem] font-extrabold leading-none tabular-nums">
                            {p.priceRon} lei
                        </p>
                        <p className="pb-1 text-ink-3">borcan de {p.weight}</p>
                    </div>

                    <AddToCartButton slug={slug} disabled={!p.inStock} className="mt-5 max-w-md" />

                    <ul className="mt-7 grid max-w-md gap-3 border-t border-rule pt-5 text-[0.95rem]">
                        <li className="flex items-start gap-3">
                            <Icon name="truck" size={20} className="mt-0.5 text-hive-blue" />
                            <span>
                                <strong>Curier la adresă, {SHIPPING_RON.ADDRESS} lei.</strong>{" "}
                                <span className="text-ink-2">Plătești la livrare, de obicei în 24–48h.</span>
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Icon name="box" size={20} className="mt-0.5 text-hive-teal" />
                            <span>
                                <strong>easybox, {SHIPPING_RON.EASYBOX} lei.</strong>{" "}
                                <span className="text-ink-2">{EASYBOX_CARD_ONLY_NOTE}</span>
                            </span>
                        </li>
                    </ul>
                </div>
            </section>

            <section className="mx-auto mt-16 max-w-6xl px-4 md:mt-24">
                {p.description ? (
                    <DetailRow title="Despre această miere">
                        <p className="text-lg leading-relaxed">{p.description}</p>
                    </DetailRow>
                ) : null}

                {p.details.origin ? (
                    <DetailRow title="Origine">
                        <p className="leading-relaxed">{p.details.origin}</p>
                    </DetailRow>
                ) : null}

                {p.details.howItsMade ? (
                    <DetailRow title="Cum se formează">
                        <p className="leading-relaxed">{p.details.howItsMade}</p>
                    </DetailRow>
                ) : null}

                {p.details.characteristics.length > 0 ? (
                    <DetailRow title="Caracteristici">
                        <Bullets items={p.details.characteristics} />
                    </DetailRow>
                ) : null}

                {p.details.benefits.length > 0 ? (
                    <DetailRow title="Beneficii">
                        <Bullets items={p.details.benefits} />
                        <p className="mt-4 text-[0.9rem] text-ink-3">
                            *Informații generale; nu înlocuiesc recomandările medicale.
                        </p>
                    </DetailRow>
                ) : null}

                {p.details.consumption.length > 0 ? (
                    <DetailRow title="Recomandare de consum">
                        <Bullets items={p.details.consumption} />
                    </DetailRow>
                ) : null}
            </section>

            {others.length > 0 ? (
                <section className="mt-16 md:mt-24" aria-labelledby="alte-sortimente">
                    <div className="mx-auto max-w-6xl px-4">
                        <h2 id="alte-sortimente" className="text-[clamp(1.8rem,3.6vw,2.6rem)] font-extrabold leading-[1.05]">
                            Alte sortimente
                        </h2>
                        <ul className="no-scrollbar -mx-4 mt-8 flex snap-x gap-4 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0">
                            {others.map((v) => {
                                const lead = v.variants[0];
                                return (
                                    <li key={v.name} className="w-[58vw] max-w-[240px] shrink-0 snap-start md:w-auto md:max-w-none">
                                        <Link href={`/magazin/${lead.slug}`} className="hive-link block h-full">
                                            <HiveFrame paint={v.paint} className="h-full">
                                                <HivePlateRow number={v.number} />
                                                <HiveWindow
                                                    src={lead.images[0]?.url}
                                                    alt={`${v.name}, borcan de ${lead.weight}`}
                                                    sizes="(max-width: 768px) 55vw, 240px"
                                                />
                                                <p className="mt-3 font-display text-lg font-extrabold leading-tight">{v.name}</p>
                                                <p className="mt-0.5 text-[0.95rem] opacity-90">
                                                    de la {Math.min(...v.variants.map((x) => x.priceRon))} lei
                                                </p>
                                            </HiveFrame>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="ground-strip" aria-hidden />
                </section>
            ) : null}
        </main>
    );
}
