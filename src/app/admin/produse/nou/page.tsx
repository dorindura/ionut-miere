import { redirect } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";
import ProductForm, { EMPTY_PRODUCT } from "@/components/admin/ProductForm";
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

        // server action = endpoint public -> verificăm rolul admin aici
        const session = await getServerSession(authOptions);
        if (!session || (session as any).role !== "ADMIN") {
            redirect("/admin/login");
        }

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
        const popular = String(formData.get("popular") || "") === "on";

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
                popular,
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
        <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
            <Link href="/admin/produse" className="inline-flex items-center gap-1.5 py-1 font-bold text-ink-2 hover:text-ink">
                <Icon name="arrowLeft" size={18} />
                Produse
            </Link>
            <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">Produs nou</h1>
            <p className="mt-1 text-ink-3">
                Pentru un gramaj nou al unui sortiment existent, folosește exact același nume.
            </p>

            <ProductForm action={createProduct} values={EMPTY_PRODUCT} submitLabel="Creează produsul" />
        </main>
    );
}
