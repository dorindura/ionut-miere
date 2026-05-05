import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import {getPrisma} from "@/lib/db";

function toStringArray(x: unknown): string[] {
    if (Array.isArray(x)) return x.map((v) => String(v));
    return [];
}

export default async function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    const prisma = getPrisma();
    if (!session || (session as any).role !== "ADMIN") redirect("/admin/login");

    const { id } = await params;

    const p = await prisma.product.findUnique({
        where: { id },
        include: { images: { orderBy: { sortOrder: "asc" } } },
    });

    if (!p) return notFound();

    const characteristics = toStringArray(p.characteristics);
    const benefits = toStringArray(p.benefits);
    const consumption = toStringArray(p.consumption);

    async function save(formData: FormData) {
        "use server";

        const prisma = getPrisma();

        const productId = String(formData.get("productId") || "");
        if (!productId) return;

        const name = String(formData.get("name") || "");
        const slug = String(formData.get("slug") || "");
        const shortDescription = String(formData.get("shortDescription") || "");
        const description = String(formData.get("description") || "");
        const weight = String(formData.get("weight") || "");
        const origin = String(formData.get("origin") || "");
        const howItsMade = String(formData.get("howItsMade") || "");

        const priceRonRaw = String(formData.get("priceRon") || "0");
        const priceRon = Number.isFinite(Number(priceRonRaw)) ? Number(priceRonRaw) : 0;

        const inStock = String(formData.get("inStock") || "") === "on";

        const parseLines = (key: string) =>
            String(formData.get(key) || "")
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean);

        const characteristics = parseLines("characteristics");
        const benefits = parseLines("benefits");
        const consumption = parseLines("consumption");
        const imageUrls = parseLines("images");

        await prisma.product.update({
            where: { id: productId },
            data: {
                name,
                slug,
                shortDescription,
                description,
                priceRon,
                weight,
                inStock,
                origin: origin || null,
                howItsMade: howItsMade || null,
                characteristics,
                benefits,
                consumption,
            },
        });

        await prisma.productImage.deleteMany({
            where: { productId },
        });

        if (imageUrls.length) {
            await prisma.productImage.createMany({
                data: imageUrls.map((url, idx) => ({
                    url,
                    alt: `${name} ${weight}`,
                    sortOrder: idx,
                    productId,
                })),
            });
        }

        redirect("/admin/produse");
    }

    return (
        <main className="mx-auto max-w-6xl px-4 py-12">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-black">Editează produs</h1>
                    <p className="mt-2 text-neutral-300">
                        Update direct în DB. Listele se scriu 1 element pe linie.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Link
                        href="/admin/produse"
                        className="rounded-xl border border-yellow-500/25 px-4 py-2 text-sm hover:border-yellow-400/60"
                    >
                        Înapoi
                    </Link>
                </div>
            </div>

            <form
                action={save}
                className="mt-8 grid gap-4 rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6"
            >
                <input type="hidden" name="productId" value={p.id} />
                <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-1 text-sm">
                        <span className="text-neutral-200">Nume</span>
                        <input
                            name="name"
                            defaultValue={p.name}
                            className="rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span className="text-neutral-200">Slug</span>
                        <input
                            name="slug"
                            defaultValue={p.slug}
                            className="rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span className="text-neutral-200">Gramaj</span>
                        <input
                            name="weight"
                            defaultValue={p.weight}
                            className="rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span className="text-neutral-200">Preț (RON)</span>
                        <input
                            name="priceRon"
                            defaultValue={String(p.priceRon)}
                            inputMode="numeric"
                            className="rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                        />
                    </label>

                    <label className="flex items-center gap-3 rounded-2xl border border-yellow-500/15 bg-neutral-950/40 px-4 py-3 text-sm">
                        <input type="checkbox" name="inStock" defaultChecked={p.inStock} />
                        <span>În stoc</span>
                    </label>
                </div>

                <label className="grid gap-1 text-sm">
                    <span className="text-neutral-200">Short description</span>
                    <textarea
                        name="shortDescription"
                        defaultValue={p.shortDescription}
                        className="min-h-[90px] rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                    />
                </label>

                <label className="grid gap-1 text-sm">
                    <span className="text-neutral-200">Description</span>
                    <textarea
                        name="description"
                        defaultValue={p.description}
                        className="min-h-[120px] rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                    />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-1 text-sm">
                        <span className="text-neutral-200">Origine</span>
                        <textarea
                            name="origin"
                            defaultValue={p.origin ?? ""}
                            className="min-h-[120px] rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span className="text-neutral-200">Cum se formează</span>
                        <textarea
                            name="howItsMade"
                            defaultValue={p.howItsMade ?? ""}
                            className="min-h-[120px] rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                        />
                    </label>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <label className="grid gap-1 text-sm">
                        <span className="text-neutral-200">Caracteristici (1 / linie)</span>
                        <textarea
                            name="characteristics"
                            defaultValue={characteristics.join("\n")}
                            className="min-h-[160px] rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span className="text-neutral-200">Beneficii (1 / linie)</span>
                        <textarea
                            name="benefits"
                            defaultValue={benefits.join("\n")}
                            className="min-h-[160px] rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span className="text-neutral-200">Consum (1 / linie)</span>
                        <textarea
                            name="consumption"
                            defaultValue={consumption.join("\n")}
                            className="min-h-[160px] rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                        />
                    </label>
                </div>

                <label className="grid gap-1 text-sm">
                    <span className="text-neutral-200">Imagini (URL-uri, 1 / linie)</span>
                    <textarea
                        name="images"
                        defaultValue={p.images.map((x) => x.url).join("\n")}
                        className="min-h-[140px] rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                    />
                    <span className="text-xs text-neutral-400">
            Ex: /images/miere-de-tei.jpeg
          </span>
                </label>

                <button
                    type="submit"
                    className="mt-2 rounded-xl bg-yellow-500 px-5 py-3 text-sm font-semibold text-neutral-950 hover:bg-yellow-400 transition-colors"
                >
                    Salvează
                </button>
            </form>
        </main>
    );
}