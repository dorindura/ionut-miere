"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = String(formData.get("email") || "");
        const password = String(formData.get("password") || "");

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Email sau parolă greșită.");
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
                <h1 className="text-2xl font-black text-yellow-300">User Login</h1>
                <p className="mt-2 text-sm text-neutral-300">
                    Autentificare pentru magazin.
                </p>

                <div className="mt-6 grid gap-4">
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                        autoComplete="email"
                        className="rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Parolă"
                        required
                        autoComplete="current-password"
                        className="rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                    />
                </div>

                {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

                <p className="mt-4 text-sm text-neutral-300">
                    Nu ai cont?{" "}
                    <a href="/cont/register" className="text-yellow-300 hover:underline">
                        Creează unul
                    </a>
                </p>

                <button
                    type="submit"
                    className="mt-6 w-full rounded-xl bg-yellow-500 px-5 py-3 text-sm font-semibold text-neutral-950 hover:bg-yellow-400 transition-colors"
                >
                    Intră în cont
                </button>
            </form>
        </main>
    );
}