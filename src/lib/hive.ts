import type { CSSProperties } from "react";
import type { OrderStatus } from "@prisma/client";

/**
 * Fiecare sortiment are „stupul" lui, vopsit ca stupii din Gârde.
 * Culoarea se alege după slug; produsele noi primesc o culoare din rotație.
 */
export type HivePaint = { paint: string; fg: string };

const PAINTS = {
    blue: { paint: "var(--color-hive-blue)", fg: "#ffffff" },
    leaf: { paint: "var(--color-hive-leaf)", fg: "#ffffff" },
    teal: { paint: "var(--color-hive-teal)", fg: "#ffffff" },
    orange: { paint: "var(--color-hive-orange)", fg: "#1c2a21" },
    sun: { paint: "var(--color-hive-sun)", fg: "#1c2a21" },
} satisfies Record<string, HivePaint>;

const ROTATION: HivePaint[] = [PAINTS.sun, PAINTS.blue, PAINTS.teal, PAINTS.orange, PAINTS.leaf];

export function hivePaint(slug: string, fallbackIndex = 0): HivePaint {
    if (slug.includes("polen")) return PAINTS.sun;
    if (slug.includes("salcam")) return PAINTS.blue;
    if (slug.includes("mana") || slug.includes("brad")) return PAINTS.leaf;
    if (slug.includes("tei")) return PAINTS.teal;
    if (slug.includes("poliflor")) return PAINTS.orange;
    return ROTATION[fallbackIndex % ROTATION.length];
}

export function hiveStyle(p: HivePaint): CSSProperties {
    return { ["--paint" as string]: p.paint, ["--paint-fg" as string]: p.fg };
}

/** grame din „1000g" / „500 g" / „1 kg" - pentru sortarea mărimilor */
export function grams(weight: string): number {
    const n = parseFloat(weight.replace(",", "."));
    if (Number.isNaN(n)) return 0;
    return /kg/i.test(weight) ? n * 1000 : n;
}

type VariantLike = { slug: string; name: string; weight: string; priceRon: number; inStock: boolean; popular?: boolean };

export type Variety<T extends VariantLike> = {
    name: string;
    variants: T[];
    popular: boolean;
    paint: HivePaint;
    number: number;
};

/** grupează produsele pe sortiment (același nume, gramaje diferite) */
export function groupByVariety<T extends VariantLike>(products: T[]): Variety<T>[] {
    const map = new Map<string, T[]>();
    for (const p of products) {
        const list = map.get(p.name) ?? [];
        list.push(p);
        map.set(p.name, list);
    }

    return [...map.entries()].map(([name, variants], i) => {
        const sorted = [...variants].sort((a, b) => grams(b.weight) - grams(a.weight));
        return {
            name,
            variants: sorted,
            popular: sorted.some((v) => v.popular),
            paint: hivePaint(sorted[0].slug, i),
            number: i + 1,
        };
    });
}

export function hiveNumber(n: number): string {
    return `Nr. ${String(n).padStart(2, "0")}`;
}

export const ORDER_STATUS: Record<OrderStatus, { label: string; className: string }> = {
    PENDING: { label: "Nouă", className: "bg-hive-orange/15 text-[#9a4210]" },
    CONFIRMED: { label: "Confirmată", className: "bg-hive-blue/12 text-hive-blue" },
    SHIPPED: { label: "Expediată", className: "bg-hive-teal/12 text-hive-teal" },
    DELIVERED: { label: "Livrată", className: "bg-hive-leaf/12 text-hive-leaf" },
    CANCELLED: { label: "Anulată", className: "bg-wash-2 text-ink-3" },
};

export const ORDER_STATUS_ORDER: OrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export function formatRon(n: number): string {
    return `${n.toLocaleString("ro-RO")} lei`;
}
