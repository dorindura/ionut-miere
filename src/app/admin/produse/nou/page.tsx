import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminCreateProductPage() {
    const session = await getServerSession(authOptions);

    if (!session || (session as any).role !== "ADMIN") {
        redirect("/admin/login");
    }

    async function createProduct(formData: FormData) {
        "use server";

        const prisma = getPrisma();

        const name = String(formData.get("name") || "").trim();
        const slug = String(formData.get("slug") || "").trim();
        const shortDescription = String(formData.get("shortDescription") || "").trim();
        const description = String(formData.get("description") || "").trim();
        const weight = String(formData.get("weight") || "").trim();
        const origin = String(formData.get("origin") || "").trim();
        const howItsMade = String(formData.get("howItsMade") || "").trim();

        const priceRon = Number(formData.get("priceRon") || 0);

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

        const product = await prisma.product.create({
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

        if (imageUrls.length) {
            await prisma.productImage.createMany({
                data: imageUrls.map((url, idx) => ({
                    url,
                    alt: `${name} ${weight}`,
                    sortOrder: idx,
                    productId: product.id,
                })),
            });
        }

        redirect("/admin/produse");
    }

    return (
        <main className="mx-auto max-w-6xl px-4 py-12">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-black">Adaugă produs</h1>

                    <p className="mt-2 text-neutral-300">
                        Creează un produs nou în magazin.
                    </p>
                </div>

                <Link
                    href="/admin/produse"
                    className="rounded-xl border border-yellow-500/25 px-4 py-2 text-sm hover:border-yellow-400/60"
                >
                    Înapoi
                </Link>
            </div>

            <form
                action={createProduct}
                className="mt-8 grid gap-4 rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6"
            >
                <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-1 text-sm">
                        <span>Nume</span>

                        <input
                            name="name"
                            required
                            className="rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3"
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span>Slug</span>

                        <input
                            name="slug"
                            required
                            className="rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3"
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span>Gramaj</span>

                        <input
                            name="weight"
                            required
                            className="rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3"
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span>Preț</span>

                        <input
                            name="priceRon"
                            type="number"
                            required
                            className="rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3"
                        />
                    </label>

                    <label className="flex items-center gap-3 rounded-2xl border border-yellow-500/15 bg-neutral-950/40 px-4 py-3 text-sm">
                        <input type="checkbox" name="inStock" defaultChecked />
                        <span>În stoc</span>
                    </label>
                </div>

                <label className="grid gap-1 text-sm">
                    <span>Short description</span>

                    <textarea
                        name="shortDescription"
                        required
                        className="min-h-[90px] rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3"
                    />
                </label>

                <label className="grid gap-1 text-sm">
                    <span>Description</span>

                    <textarea
                        name="description"
                        required
                        className="min-h-[120px] rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3"
                    />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-1 text-sm">
                        <span>Origine</span>

                        <textarea
                            name="origin"
                            className="min-h-[120px] rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3"
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span>Cum se formează</span>

                        <textarea
                            name="howItsMade"
                            className="min-h-[120px] rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3"
                        />
                    </label>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <label className="grid gap-1 text-sm">
                        <span>Caracteristici</span>

                        <textarea
                            name="characteristics"
                            className="min-h-[160px] rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3"
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span>Beneficii</span>

                        <textarea
                            name="benefits"
                            className="min-h-[160px] rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3"
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span>Consum</span>

                        <textarea
                            name="consumption"
                            className="min-h-[160px] rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3"
                        />
                    </label>
                </div>

                <label className="grid gap-1 text-sm">
                    <span>Imagini (1 URL / linie)</span>

                    <textarea
                        name="images"
                        className="min-h-[140px] rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3"
                    />
                </label>

                <button
                    type="submit"
                    className="rounded-xl bg-yellow-500 px-5 py-3 text-sm font-semibold text-neutral-950 hover:bg-yellow-400"
                >
                    Creează produs
                </button>
            </form>
        </main>
    );
}