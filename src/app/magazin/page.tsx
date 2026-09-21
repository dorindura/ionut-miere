import type { Metadata } from "next";
import ShopHive from "@/components/ShopHive";
import Icon from "@/components/Icon";
import { getVarieties } from "@/lib/varieties";
import { SHIPPING_RON } from "@/lib/shipping";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Magazin — miere de salcâm, mană de brad, tei și polifloră",
    description:
        "Alege mierea din stupina noastră din Munții Apuseni, în borcan de 500g sau 1000g. Livrare prin curier sau easybox, plata ramburs.",
};

export default async function MagazinPage() {
    const varieties = await getVarieties();

    return (
        <main className="pb-20">
            <section className="mx-auto max-w-6xl px-4 pt-10 md:pt-14">
                <h1 className="max-w-3xl text-[2.6rem] font-extrabold leading-[1.02] md:text-[4rem]">
                    Alege mierea
                </h1>
                <p className="mt-3 max-w-xl text-lg text-ink-2">
                    Sortimentele din stupina noastră din Gârde. Alegi gramajul și adaugi direct în coș.
                </p>

                <dl className="mt-7 grid gap-x-8 gap-y-3 border-y border-rule py-4 text-[0.95rem] sm:grid-cols-3">
                    <div className="flex items-start gap-2.5">
                        <Icon name="truck" size={20} className="mt-0.5 text-hive-blue" />
                        <div>
                            <dt className="font-bold">Curier la adresă</dt>
                            <dd className="text-ink-3">{SHIPPING_RON.ADDRESS} lei · de obicei 24–48h</dd>
                        </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                        <Icon name="box" size={20} className="mt-0.5 text-hive-teal" />
                        <div>
                            <dt className="font-bold">easybox</dt>
                            <dd className="text-ink-3">{SHIPPING_RON.EASYBOX} lei · ramburs doar cu cardul</dd>
                        </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                        <Icon name="cash" size={20} className="mt-0.5 text-hive-leaf" />
                        <div>
                            <dt className="font-bold">Plata la livrare</dt>
                            <dd className="text-ink-3">Nu ai nevoie de cont</dd>
                        </div>
                    </div>
                </dl>
            </section>

            <section aria-label="Sortimente" className="mt-12">
                <div className="mx-auto max-w-6xl px-4">
                    <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                        {varieties.map((v, i) => {
                            const lead = v.variants[0];
                            return (
                                <li key={v.name} className="rise flex flex-col" style={{ animationDelay: `${i * 70}ms` }}>
                                    <ShopHive
                                        name={v.name}
                                        shortDescription={lead.shortDescription}
                                        number={v.number}
                                        paint={v.paint}
                                        popular={v.popular}
                                        priority={i < 2}
                                        variants={v.variants.map((x) => ({
                                            slug: x.slug,
                                            weight: x.weight,
                                            priceRon: x.priceRon,
                                            inStock: x.inStock,
                                            image: x.images[0]?.url,
                                        }))}
                                    />
                                    {/* fiecare stup stă pe iarba lui; cu -mx-3 fâșiile se unesc pe rând */}
                                    <div className="ground-strip -mx-3" aria-hidden />
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </section>
        </main>
    );
}
