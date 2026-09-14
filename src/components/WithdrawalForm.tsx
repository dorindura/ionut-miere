"use client";

import { useState } from "react";

const INPUT_CLASS =
    "w-full min-w-0 rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60";

const FIELDS = ["fullName", "email", "phone", "orderId", "products", "receivedDate", "iban", "details"] as const;

export default function WithdrawalForm({ contactEmail }: { contactEmail: string }) {
    const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

    async function onSubmit(formData: FormData) {
        setState("sending");

        const payload = Object.fromEntries(FIELDS.map((k) => [k, String(formData.get(k) ?? "")]));

        try {
            const res = await fetch("/api/retur", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            setState(res.ok ? "sent" : "error");
        } catch {
            setState("error");
        }
    }

    if (state === "sent") {
        return (
            <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
                Am primit cererea ta de retragere. Ți-am trimis pe email confirmarea de primire și revenim cu pașii
                pentru retur.
            </p>
        );
    }

    return (
        <form action={onSubmit} className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid min-w-0 gap-1">
                    <span className="text-neutral-200">Nume complet *</span>
                    <input name="fullName" required autoComplete="name" className={INPUT_CLASS} />
                </label>

                <label className="grid min-w-0 gap-1">
                    <span className="text-neutral-200">Email *</span>
                    <input name="email" type="email" required autoComplete="email" className={INPUT_CLASS} />
                </label>

                <label className="grid min-w-0 gap-1">
                    <span className="text-neutral-200">Telefon</span>
                    <input name="phone" type="tel" autoComplete="tel" className={INPUT_CLASS} />
                </label>

                <label className="grid min-w-0 gap-1">
                    <span className="text-neutral-200">ID comandă *</span>
                    <input
                        name="orderId"
                        required
                        placeholder="din emailul de confirmare"
                        className={INPUT_CLASS}
                    />
                </label>
            </div>

            <label className="grid gap-1">
                <span className="text-neutral-200">Produsele returnate *</span>
                <textarea
                    name="products"
                    required
                    placeholder="ex. 1 x Miere de mană de brad 1000g"
                    className={`${INPUT_CLASS} min-h-[90px]`}
                />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid min-w-0 gap-1">
                    <span className="text-neutral-200">Data primirii coletului</span>
                    <input name="receivedDate" type="date" className={INPUT_CLASS} />
                </label>

                <label className="grid min-w-0 gap-1">
                    <span className="text-neutral-200">IBAN (doar pentru plata ramburs)</span>
                    <input name="iban" autoComplete="off" placeholder="RO.." className={INPUT_CLASS} />
                </label>
            </div>

            <label className="grid gap-1">
                <span className="text-neutral-200">Alte detalii</span>
                <textarea name="details" className={`${INPUT_CLASS} min-h-[80px]`} />
            </label>

            <button
                type="submit"
                disabled={state === "sending"}
                className="mt-1 rounded-xl bg-yellow-500 px-6 py-3 font-semibold text-neutral-950 hover:bg-yellow-400 disabled:opacity-50"
            >
                {state === "sending" ? "Se trimite..." : "Trimite cererea de retragere"}
            </button>

            {state === "error" ? (
                <p className="text-red-300">
                    Cererea nu a putut fi trimisă. Te rugăm să încerci din nou sau să ne scrii la {contactEmail}.
                </p>
            ) : null}
        </form>
    );
}
