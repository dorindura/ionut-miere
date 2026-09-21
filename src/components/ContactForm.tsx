"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

export default function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    async function onSubmit(formData: FormData) {
        setLoading(true);
        setStatus("idle");

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
        }).catch(() => null);

        setLoading(false);
        setStatus(res?.ok ? "success" : "error");
    }

    return (
        <form action={onSubmit} className="grid gap-4">
            <label className="label">
                Nume
                <input className="field" placeholder="Numele tău" name="name" autoComplete="name" required />
            </label>

            <label className="label">
                Email
                <input
                    className="field"
                    placeholder="email@exemplu.ro"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                />
            </label>

            <label className="label">
                Mesaj
                <textarea
                    className="field"
                    placeholder="Spune-ne ce sortiment/gramaj te interesează…"
                    name="message"
                    required
                />
            </label>

            <button disabled={loading} type="submit" className="btn btn-ink mt-1 text-base">
                {loading ? "Se trimite…" : "Trimite mesajul"}
            </button>

            <p aria-live="polite" className="empty:hidden">
                {status === "success" ? (
                    <span className="inline-flex items-center gap-2 font-bold text-hive-leaf">
                        <Icon name="check" size={18} />
                        Mesaj trimis. Îți răspundem cât de curând.
                    </span>
                ) : status === "error" ? (
                    <span className="text-hive-red">
                        Mesajul nu a putut fi trimis. Încearcă din nou sau sună-ne direct.
                    </span>
                ) : null}
            </p>
        </form>
    );
}
