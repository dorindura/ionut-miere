"use client";

import { useState } from "react";

export default function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    async function onSubmit(formData: FormData) {
        setLoading(true);
        setSuccess(false);

        const payload = {
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message"),
        };

        const res = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        setLoading(false);

        if (res.ok) {
            setSuccess(true);
        }
    }

    return (
        <form
            action={onSubmit}
            className="grid gap-3"
        >
            <label className="grid gap-1 text-sm">
                <span className="text-neutral-200">Nume</span>

                <input
                    className="rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                    placeholder="Numele tău"
                    name="name"
                    autoComplete="name"
                    required
                />
            </label>

            <label className="grid gap-1 text-sm">
                <span className="text-neutral-200">Email</span>

                <input
                    className="rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                    placeholder="email@exemplu.ro"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                />
            </label>

            <label className="grid gap-1 text-sm">
                <span className="text-neutral-200">Mesaj</span>

                <textarea
                    className="min-h-[120px] rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                    placeholder="Spune-ne ce sortiment/gramaj te interesează…"
                    name="message"
                    required
                />
            </label>

            <button
                disabled={loading}
                type="submit"
                className="mt-2 rounded-xl bg-yellow-500 px-5 py-3 text-sm font-semibold text-neutral-950 hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
                {loading ? "Se trimite..." : "Trimite mesaj"}
            </button>

            {success && (
                <p className="text-sm text-green-400">
                    Mesaj trimis cu succes.
                </p>
            )}
        </form>
    );
}