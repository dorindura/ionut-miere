"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartItemActions({
                                            productId,
                                            qty,
                                        }: {
    productId: string;
    qty: number;
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
        <div className="flex flex-wrap items-center gap-2">
            <button
                type="button"
                disabled={loading || qty <= 1}
                onClick={() => setQty(qty - 1)}
                className="rounded-xl border border-yellow-500/25 px-3 py-2 text-sm hover:border-yellow-400/60 disabled:opacity-60"
            >
                −
            </button>

            <span className="min-w-[40px] text-center text-sm text-neutral-200">
        {qty}
      </span>

            <button
                type="button"
                disabled={loading}
                onClick={() => setQty(qty + 1)}
                className="rounded-xl border border-yellow-500/25 px-3 py-2 text-sm hover:border-yellow-400/60 disabled:opacity-60"
            >
                +
            </button>

            <button
                type="button"
                disabled={loading}
                onClick={remove}
                className="ml-2 rounded-xl border border-red-500/25 px-3 py-2 text-sm text-red-200 hover:border-red-400/60 disabled:opacity-60"
            >
                Șterge
            </button>
        </div>
    );
}