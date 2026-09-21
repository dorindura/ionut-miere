"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiveMark } from "@/components/Icon";

export default function AdminLoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

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
            setLoading(false);
            return;
        }

        router.push("/admin");
        router.refresh();
    }

    return (
        <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
            <form onSubmit={onSubmit} className="sheet w-full max-w-sm overflow-hidden">
                <div className="h-2 bg-hive-blue" aria-hidden />
                <div className="p-6">
                    <HiveMark size={40} />
                    <h1 className="mt-4 text-2xl font-extrabold">Administrare</h1>
                    <p className="mt-1 text-ink-3">Intră ca să vezi comenzile și produsele.</p>

                    <div className="mt-6 grid gap-4">
                        <label className="label">
                            Email
                            <input name="email" type="email" required autoComplete="email" className="field" />
                        </label>
                        <label className="label">
                            Parolă
                            <input
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                className="field"
                            />
                        </label>
                    </div>

                    <p aria-live="polite" className="mt-3 text-hive-red empty:hidden">
                        {error}
                    </p>

                    <button type="submit" disabled={loading} className="btn btn-ink mt-5 w-full text-base">
                        {loading ? "Se verifică…" : "Intră în admin"}
                    </button>
                </div>
            </form>
        </main>
    );
}
