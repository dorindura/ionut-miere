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
        <main className="flex min-h-[70vh] items-center justify-center py-16 px-4">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-md sheet p-8"
            >
                <h1 className="text-2xl font-extrabold text-ink">User Login</h1>
                <p className="mt-2 text-sm text-ink-2">
                    Autentificare pentru magazin.
                </p>

                <div className="mt-6 grid gap-4">
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                        autoComplete="email"
                        className="field"
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Parolă"
                        required
                        autoComplete="current-password"
                        className="field"
                    />
                </div>

                {error && <p className="mt-4 text-sm text-hive-red">{error}</p>}

                <p className="mt-4 text-sm text-ink-2">
                    Nu ai cont?{" "}
                    <a href="/cont/register" className="text-hive-blue underline">
                        Creează unul
                    </a>
                </p>

                <button
                    type="submit"
                    className="mt-6 w-full btn btn-primary"
                >
                    Intră în cont
                </button>
            </form>
        </main>
    );
}