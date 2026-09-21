"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState("");

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        const fd = new FormData(e.currentTarget);
        const name = String(fd.get("name") || "");
        const email = String(fd.get("email") || "");
        const password = String(fd.get("password") || "");

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) {
            setError(data.error || "Eroare la înregistrare");
            return;
        }

        // auto-login după register
        const login = await signIn("credentials", { email, password, redirect: false });
        if (login?.error) {
            router.push("/cont/login");
            return;
        }

        router.push("/magazin");
        router.refresh();
    }

    return (
        <main className="flex min-h-[70vh] items-center justify-center py-16 px-4">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-md sheet p-8"
            >
                <h1 className="text-2xl font-extrabold text-ink">Creează cont</h1>

                <div className="mt-6 grid gap-4">
                    <input name="name" placeholder="Nume" className="field" />
                    <input name="email" type="email" required placeholder="Email" className="field" />
                    <input name="password" type="password" required placeholder="Parolă (min 8)" className="field" />
                </div>

                {error && <p className="mt-4 text-sm text-hive-red">{error}</p>}

                <button className="mt-6 w-full btn btn-primary">
                    Creează cont
                </button>

                <p className="mt-4 text-sm text-ink-2">
                    Ai deja cont? <a className="text-hive-blue underline" href="/cont/login">Autentifică-te</a>
                </p>
            </form>
        </main>
    );
}