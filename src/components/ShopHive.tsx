"use client";

import Link from "next/link";
import { useState } from "react";
import type { HivePaint } from "@/lib/hive";
import AddToCartButton from "@/components/AddToCartButton";
import { HiveFrame, HivePlateRow, HiveWindow } from "@/components/HiveFront";
import Icon from "@/components/Icon";

export type ShopVariant = {
    slug: string;
    weight: string;
    priceRon: number;
    inStock: boolean;
    image?: string;
};

/** un sortiment în magazin: alegi gramajul și adaugi direct în coș */
export default function ShopHive({
    name,
    shortDescription,
    number,
    paint,
    popular,
    variants,
    priority,
}: {
    name: string;
    shortDescription: string;
    number: number;
    paint: HivePaint;
    popular: boolean;
    variants: ShopVariant[];
    priority?: boolean;
}) {
    const firstAvailable = variants.find((v) => v.inStock) ?? variants[0];
    const [slug, setSlug] = useState(firstAvailable.slug);
    const current = variants.find((v) => v.slug === slug) ?? firstAvailable;
    const groupName = `gramaj-${number}`;

    return (
        <HiveFrame paint={paint} className="h-full w-full">
            <HivePlateRow number={number} popular={popular} />

            <Link href={`/magazin/${current.slug}`} className="block" aria-label={`${name} ${current.weight} — detalii`}>
                <HiveWindow
                    src={current.image}
                    alt={`${name}, borcan de ${current.weight}`}
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 280px"
                    priority={priority}
                    soldOut={!current.inStock}
                    aspect="aspect-[6/5] sm:aspect-[4/5]"
                />
            </Link>

            <div className="mt-4 flex items-start justify-between gap-3">
                <h2 className="text-[1.45rem] font-extrabold leading-[1.1]">
                    <Link href={`/magazin/${current.slug}`} className="hover:underline">
                        {name}
                    </Link>
                </h2>
                <p className="shrink-0 font-display text-[1.45rem] font-extrabold leading-[1.1] tabular-nums">
                    {current.priceRon} lei
                </p>
            </div>
            <p className="mt-1.5 text-[0.95rem] leading-snug opacity-90">{shortDescription}</p>

            {variants.length > 1 ? (
                <fieldset className="mt-4">
                    <legend className="sr-only">Alege gramajul</legend>
                    <div className="flex gap-2">
                        {variants.map((v) => {
                            const checked = v.slug === slug;
                            return (
                                <label
                                    key={v.slug}
                                    className={`relative flex min-h-11 flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border-2 px-2 py-1 text-center transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-white ${
                                        checked
                                            ? "border-white bg-white text-ink"
                                            : "border-white/55 hover:border-white"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name={groupName}
                                        value={v.slug}
                                        checked={checked}
                                        onChange={() => setSlug(v.slug)}
                                        className="sr-only"
                                    />
                                    <span className="text-[0.95rem] font-bold leading-tight">{v.weight}</span>
                                    <span className={`text-[0.78rem] leading-tight ${checked ? "text-ink-3" : "opacity-85"}`}>
                                        {v.inStock ? `${v.priceRon} lei` : "epuizat"}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </fieldset>
            ) : (
                <p className="mt-4 text-[0.95rem] font-bold">Borcan de {current.weight}</p>
            )}

            {/* key: la schimbarea gramajului butonul revine la starea inițială */}
            <AddToCartButton key={current.slug} slug={current.slug} disabled={!current.inStock} tone="onPaint" className="mt-3" />

            <Link
                href={`/magazin/${current.slug}`}
                className="mt-2 inline-flex items-center gap-1 self-start py-1 text-[0.9rem] font-bold underline-offset-4 hover:underline"
            >
                Gust, origine, beneficii
                <Icon name="arrowRight" size={16} />
            </Link>
        </HiveFrame>
    );
}
