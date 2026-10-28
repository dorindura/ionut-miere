"use client";

import Link from "next/link";
import { ANALYTICS_CONFIGURED, writeConsent } from "@/lib/analytics";
import { useConsent } from "@/lib/useConsent";

/**
 * Bannerul de acord pentru cookie-urile de analiză.
 *
 * Apare o singură dată, până când vizitatorul alege. Cât timp nu a ales,
 * `Analytics` nu încarcă nimic — deci „Refuz" e și starea implicită.
 */
export default function CookieConsent() {
    const consent = useConsent();

    // pe server și la prima randare `consent` e null; bannerul apare după hidratare
    if (!ANALYTICS_CONFIGURED || consent !== null) return null;

    return (
        <div
            role="dialog"
            aria-label="Acord cookie-uri"
            className="fixed inset-x-0 bottom-0 z-50 border-t border-rule bg-paper p-4 shadow-[0_-8px_24px_rgba(28,42,33,0.12)]"
        >
            <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p className="max-w-[65ch] text-[0.95rem] text-ink-2">
                    Folosim cookie-uri de analiză ca să vedem ce pagini sunt căutate și cum putem face magazinul mai
                    bun. Fără acordul tău nu încărcăm niciunul. Detalii în{" "}
                    <Link href="/cookies" className="font-semibold text-ink underline">
                        Politica de cookies
                    </Link>
                    .
                </p>

                <div className="flex shrink-0 gap-3">
                    <button type="button" onClick={() => writeConsent("denied")} className="btn btn-ghost">
                        Refuz
                    </button>
                    <button type="button" onClick={() => writeConsent("granted")} className="btn btn-primary">
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
