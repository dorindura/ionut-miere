import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import {getPrisma} from "@/lib/db";
import Icon from "@/components/Icon";
import { formatRon, grams, hivePaint } from "@/lib/hive";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
    const session = await getServerSession(authOptions);
    const prisma = getPrisma();
    if (!session || (session as any).role !== "ADMIN") redirect("/admin/login");

    const items = await prisma.product.findMany({
        orderBy: [{ name: "asc" }],
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    });

    // gramajele aceluiași sortiment unul lângă altul, cel mare primul
    items.sort((a, b) => a.name.localeCompare(b.name, "ro") || grams(b.weight) - grams(a.weight));

    return (
        <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold md:text-4xl">Produse</h1>
                    <p className="mt-1 text-ink-3">
                        {items.length} produse · {items.filter((p) => !p.inStock).length} epuizate
                    </p>
                </div>
                <Link href="/admin/produse/nou" className="btn btn-primary">
                    <Icon name="plus" size={18} />
                    Adaugă produs
                </Link>
            </div>

            <div className="sheet mt-6 overflow-hidden">
                {items.length === 0 ? (
                    <div className="px-4 py-14 text-center">
                        <p className="font-bold">Niciun produs încă.</p>
                        <p className="mt-1 text-ink-3">Adaugă primul sortiment ca să apară în magazin.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-rule">
                        {items.map((p, i) => {
                            const paint = hivePaint(p.slug, i);
                            return (
                                <li key={p.id}>
                                    <Link
                                        href={`/admin/produse/${p.id}`}
                                        className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 px-4 py-3 hover:bg-wash"
                                    >
                                        <span
                                            className="relative block h-16 w-14 overflow-hidden rounded-md border-t-[5px] bg-white"
                                            style={{ borderTopColor: paint.paint }}
                                        >
                                            {p.images[0]?.url ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={p.images[0].url} alt="" className="h-full w-full object-contain" />
                                            ) : (
                                                <Icon name="jar" size={24} className="m-auto mt-4 text-ink-3" />
                                            )}
                                        </span>
                                        <span className="min-w-0">
                                            <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                <span className="font-bold">{p.name}</span>
                                                <span className="text-ink-3">{p.weight}</span>
                                                {p.popular ? (
                                                    <span className="inline-flex items-center gap-1 text-[0.8rem] font-bold text-[#8a6400]">
                                                        <Icon name="star" size={13} className="fill-hive-sun" />
                                                        Popular
                                                    </span>
                                                ) : null}
                                            </span>
                                            <span className="mt-0.5 block truncate text-[0.85rem] text-ink-3">/{p.slug}</span>
                                        </span>
                                        <span className="flex flex-col items-end gap-1">
                                            <span className="font-bold tabular-nums">{formatRon(p.priceRon)}</span>
                                            <span
                                                className={`chip ${
                                                    p.inStock ? "bg-hive-leaf/12 text-hive-leaf" : "bg-hive-red/12 text-hive-red"
                                                }`}
                                            >
                                                {p.inStock ? "În stoc" : "Epuizat"}
                                            </span>
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </main>
    );
}
