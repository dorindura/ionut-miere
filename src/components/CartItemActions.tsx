"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Icon from "@/components/Icon";

export default function CartItemActions({
                                            productId,
                                            qty,
                                            name,
                                        }: {
    productId: string;
    qty: number;
    name?: string;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function setQty(nextQty: number) {
        setLoading(true);
        const res = await fetch("/api/cart/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, qty: nextQty }),
        });

        if (res.status === 401) {
            router.push("/cont/login");
            return;
        }

        setLoading(false);
        router.refresh();
    }

    async function remove() {
        setLoading(true);
        const res = await fetch("/api/cart/remove", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
        });

        if (res.status === 401) {
            router.push("/cont/login");
            return;
        }

        setLoading(false);
        router.refresh();
    }

    return (
        <div className={`flex flex-wrap items-center gap-3 ${loading ? "opacity-60" : ""}`} aria-busy={loading}>
            <div className="inline-flex items-center rounded-lg border-[1.5px] border-rule-strong bg-paper">
                <button
                    type="button"
                    disabled={loading || qty <= 1}
                    onClick={() => setQty(qty - 1)}
                    aria-label={`Scade cantitatea${name ? ` pentru ${name}` : ""}`}
                    className="grid h-11 w-11 place-items-center rounded-l-lg hover:bg-wash disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <Icon name="minus" size={18} />
                </button>

                <span className="min-w-10 text-center font-bold tabular-nums" aria-live="polite">
                    {qty}
                </span>

                <button
                    type="button"
                    disabled={loading}
                    onClick={() => setQty(qty + 1)}
                    aria-label={`Crește cantitatea${name ? ` pentru ${name}` : ""}`}
                    className="grid h-11 w-11 place-items-center rounded-r-lg hover:bg-wash disabled:opacity-40"
                >
                    <Icon name="plus" size={18} />
                </button>
            </div>

            <button
                type="button"
                disabled={loading}
                onClick={remove}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-[0.9rem] font-bold text-ink-3 hover:text-hive-red disabled:opacity-40"
            >
                <Icon name="trash" size={16} />
                Șterge
            </button>
        </div>
    );
}
