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

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            setError(data?.error || "Eroare la înregistrare");
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
        <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-md rounded-3xl border border-yellow-500/15 bg-neutral-900/40 p-8"
            >
                <h1 className="text-2xl font-black text-yellow-300">Creează cont</h1>

                <div className="mt-6 grid gap-4">
                    <input name="name" placeholder="Nume" className="rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60" />
                    <input name="email" type="email" required placeholder="Email" className="rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60" />
                    <input name="password" type="password" required placeholder="Parolă (min 8)" className="rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60" />
                </div>

                {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

                <button className="mt-6 w-full rounded-xl bg-yellow-500 px-5 py-3 text-sm font-semibold text-neutral-950 hover:bg-yellow-400">
                    Creează cont
                </button>

                <p className="mt-4 text-sm text-neutral-300">
                    Ai deja cont? <a className="text-yellow-300 hover:underline" href="/cont/login">Autentifică-te</a>
                </p>
            </form>
        </main>
    );
}