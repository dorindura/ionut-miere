"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Icon from "@/components/Icon";

export default function AddToCartButton({
    slug,
    qty = 1,
    disabled = false,
    tone = "primary",
    className = "",
}: {
    slug: string;
    qty?: number;
    disabled?: boolean;
    /** „onPaint" = buton alb pe fațada vopsită a stupului */
    tone?: "primary" | "onPaint";
    className?: string;
}) {
    const router = useRouter();
    const [state, setState] = useState<"idle" | "loading" | "added" | "error">("idle");
    const [error, setError] = useState("");

    async function add() {
        setState("loading");
        setError("");

        const res = await fetch("/api/cart/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug, qty }),
        });

        if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as { error?: string };
            setError(data.error || "Nu am putut adăuga produsul. Încearcă din nou.");
            setState("error");
            return;
        }

        setState("added");
        router.refresh();
    }

    const base =
        tone === "onPaint"
            ? "btn w-full bg-white text-ink hover:bg-wash"
            : "btn btn-primary w-full text-base";

    return (
        <div className={`grid gap-2 ${className}`}>
            <button type="button" onClick={add} disabled={disabled || state === "loading"} className={base}>
                {state === "loading" ? (
                    "Se adaugă…"
                ) : state === "added" ? (
                    <>
                        <Icon name="check" size={18} />
                        Adăugat în coș
                    </>
                ) : disabled ? (
                    "Stoc epuizat"
                ) : (
                    <>
                        <Icon name="cart" size={18} />
                        Adaugă în coș
                    </>
                )}
            </button>

            <p aria-live="polite" className="min-h-0 text-[0.9rem] empty:hidden">
                {state === "added" ? (
                    <Link href="/cos" className="inline-flex items-center gap-1 font-bold underline">
                        Vezi coșul și finalizează
                        <Icon name="arrowRight" size={16} />
                    </Link>
                ) : state === "error" ? (
                    <span className={tone === "onPaint" ? "rounded bg-white px-2 py-1 text-hive-red" : "text-hive-red"}>
                        {error}
                    </span>
                ) : null}
            </p>
        </div>
    );
}
