import ProductCard from "@/components/ProductCard";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function MagazinPage() {
    const prisma = getPrisma();

    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            images: {
                orderBy: {
                    sortOrder: "asc",
                },
            },
        },
    });

    const mappedProducts = products.map((p) => ({
        ...p,
        images: p.images.map((x) => x.url),
        details: {
            origin: p.origin ?? undefined,
            howItsMade: p.howItsMade ?? undefined,
            characteristics: Array.isArray(p.characteristics)
                ? p.characteristics.map(String)
                : [],
            benefits: Array.isArray(p.benefits)
                ? p.benefits.map(String)
                : [],
            consumption: Array.isArray(p.consumption)
                ? p.consumption.map(String)
                : [],
        },
    }));

    return (
        <main className="mx-auto max-w-6xl px-4 py-12">
            <h1 className="text-3xl font-black">Magazin</h1>

            <p className="mt-2 text-neutral-300">
                Alege sortimentul preferat. Livrare rapidă, ambalare sigură.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
                {mappedProducts.map((p) => (
                    <ProductCard key={p.id} p={p} />
                ))}
            </div>
        </main>
    );
}