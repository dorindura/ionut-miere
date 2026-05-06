import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import {getPrisma} from "@/lib/db";

export default async function AdminProductsPage() {
    const session = await getServerSession(authOptions);
    const prisma = getPrisma();
    if (!session || (session as any).role !== "ADMIN") redirect("/admin/login");

    const items = await prisma.product.findMany({
        orderBy: [{ updatedAt: "desc" }],
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    });

    return (
        <main className="mx-auto max-w-6xl px-4 py-12">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-black">Produse</h1>
                    <p className="mt-2 text-neutral-300">
                        Listă produse din DB. Click pe un produs ca să-l editezi.
                    </p>
                </div>

                <div className="flex flex-col gap-3 md:flex-row">
                <Link
                    href="/admin"
                    className="inline-flex rounded-xl border border-yellow-500/25 px-4 py-2 text-sm hover:border-yellow-400/60"
                >
                    Înapoi la dashboard
                </Link>

                <Link
                    href="/admin/produse/nou"
                    className="inline-flex rounded-xl bg-yellow-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-yellow-400"
                >
                    Adaugă produs
                </Link>
                </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
                {items.map((p) => (
                    <Link
                        key={p.id}
                        href={`/admin/produse/${p.id}`}
                        className="group rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-5 hover:border-yellow-400/40 transition-colors"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-bold">{p.name}</h2>
                                <p className="mt-1 text-sm text-neutral-300">
                                    {p.weight} •{" "}
                                    <span className="text-yellow-300 font-semibold">
                    {p.priceRon ? `${p.priceRon} RON` : "—"}
                  </span>
                                </p>
                                <p className="mt-2 text-xs text-neutral-400">{p.slug}</p>
                            </div>

                            <span
                                className={`shrink-0 rounded-full border px-3 py-1 text-xs ${
                                    p.inStock
                                        ? "border-yellow-500/25 bg-yellow-500/10 text-yellow-200"
                                        : "border-neutral-700 bg-neutral-900/40 text-neutral-300"
                                }`}
                            >
                {p.inStock ? "În stoc" : "Stoc epuizat"}
              </span>
                        </div>

                        <p className="mt-3 text-sm text-neutral-300 line-clamp-2">
                            {p.shortDescription}
                        </p>

                        <div className="mt-4 text-sm text-neutral-200">
                            Editează →
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}