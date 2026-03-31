import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    if (!session || (session as any).role !== "ADMIN") {
        redirect("/admin/login");
    }

    return (
        <main className="mx-auto max-w-6xl px-4 py-12">
            <h1 className="text-3xl font-black">Admin Dashboard</h1>
            <p className="mt-2 text-neutral-300">
                Gestionare produse și comentarii.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
                <Link
                    className="rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6 hover:border-yellow-400/40"
                    href="/admin/produse"
                >
                    Produse
                </Link>
                <Link
                    className="rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6 hover:border-yellow-400/40"
                    href="/admin/comentarii"
                >
                    Comentarii
                </Link>
            </div>
        </main>
    );
}