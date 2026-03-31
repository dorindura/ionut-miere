"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddToCartButton({ slug }: { slug: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    async function add() {
        setLoading(true);
        setMsg("");

        const res = await fetch("/api/cart/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug, qty: 1 }),
        });

        if (res.status === 401) {
            router.push("/cont/login");
            return;
        }

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setMsg(data?.error || "Eroare. Încearcă din nou.");
            setLoading(false);
            return;
        }

        setMsg("Adăugat în coș ✅");
        setLoading(false);
        router.refresh();
    }

    return (
        <div className="grid gap-2">
            <button
                type="button"
                onClick={add}
                disabled={loading}
                className="rounded-xl bg-yellow-500 px-5 py-3 text-sm font-semibold text-neutral-950 hover:bg-yellow-400 disabled:opacity-70"
            >
                {loading ? "Se adaugă..." : "Adaugă în coș"}
            </button>
            {msg && <p className="text-xs text-neutral-300">{msg}</p>}
        </div>
    );
}