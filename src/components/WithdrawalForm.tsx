"use client";

import { useState } from "react";

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
            <p className="rounded-lg bg-hive-leaf/12 px-4 py-3 font-semibold text-hive-leaf">
                Am primit cererea ta de retragere. Ți-am trimis pe email confirmarea de primire și te sunăm ca să
                programăm ridicarea coletului.
            </p>
        );
    }

    return (
        <form action={onSubmit} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <label className="label">
                    Nume complet *
                    <input name="fullName" required autoComplete="name" className="field" />
                </label>

                <label className="label">
                    Email *
                    <input name="email" type="email" required autoComplete="email" className="field" />
                </label>

                <label className="label">
                    Telefon
                    <input name="phone" type="tel" autoComplete="tel" className="field" />
                </label>

                <label className="label">
                    Număr comandă *
                    <input name="orderId" required placeholder="din emailul de confirmare" className="field" />
                </label>
            </div>

            <label className="label">
                Produsele returnate *
                <textarea
                    name="products"
                    required
                    rows={3}
                    placeholder="ex. 1 x Miere de mană de brad 1000g"
                    className="field"
                />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
                <label className="label">
                    Data primirii coletului
                    <input name="receivedDate" type="date" className="field" />
                </label>

                <label className="label">
                    IBAN pentru rambursare
                    <input name="iban" autoComplete="off" placeholder="RO.." className="field" />
                </label>
            </div>

            <label className="label">
                Alte detalii
                <textarea name="details" rows={2} className="field" />
            </label>

            <button type="submit" disabled={state === "sending"} className="btn btn-primary justify-self-start">
                {state === "sending" ? "Se trimite..." : "Trimite cererea de retragere"}
            </button>

            {state === "error" ? (
                <p className="rounded-lg bg-hive-red/10 px-4 py-3 text-[0.95rem] text-hive-red">
                    Cererea nu a putut fi trimisă. Încearcă din nou sau scrie-ne la {contactEmail}.
                </p>
            ) : null}
        </form>
    );
}
