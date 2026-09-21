import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";
import ProductForm from "@/components/admin/ProductForm";
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

        // server action = endpoint public -> verificăm rolul admin aici
        const session = await getServerSession(authOptions);
        if (!session || (session as any).role !== "ADMIN") {
            redirect("/admin/login");
        }

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
                popular,
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
        <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
            <Link href="/admin/produse" className="inline-flex items-center gap-1.5 py-1 font-bold text-ink-2 hover:text-ink">
                <Icon name="arrowLeft" size={18} />
                Produse
            </Link>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-extrabold md:text-4xl">{p.name}</h1>
                    <p className="mt-1 text-ink-3">{p.weight} · editare</p>
                </div>
                <Link href={`/magazin/${p.slug}`} target="_blank" className="btn btn-ghost btn-sm bg-paper">
                    Vezi în magazin
                    <Icon name="external" size={16} />
                </Link>
            </div>

            <ProductForm
                action={save}
                submitLabel="Salvează modificările"
                values={{
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    weight: p.weight,
                    priceRon: p.priceRon,
                    inStock: p.inStock,
                    popular: p.popular,
                    shortDescription: p.shortDescription,
                    description: p.description,
                    origin: p.origin ?? "",
                    howItsMade: p.howItsMade ?? "",
                    characteristics,
                    benefits,
                    consumption,
                    images: p.images.map((x) => x.url),
                }}
            />
        </main>
    );
}
