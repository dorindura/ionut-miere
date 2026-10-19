import type { MetadataRoute } from "next";
import { getPrisma } from "@/lib/db";

const siteUrl = "https://prisaca-apuseni.com";

// generat la cerere, ca restul paginilor: build-ul nu are nevoie de baza de date
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const prisma = getPrisma();

    const products = await prisma.product.findMany({
        select: { slug: true, updatedAt: true, images: { select: { url: true }, orderBy: { sortOrder: "asc" } } },
    });

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: siteUrl, changeFrequency: "weekly", priority: 1 },
        { url: `${siteUrl}/magazin`, changeFrequency: "weekly", priority: 0.8 },
        { url: `${siteUrl}/retur`, changeFrequency: "yearly", priority: 0.3 },
        ...["termeni", "confidentialitate", "cookies"].map((path) => ({
            url: `${siteUrl}/${path}`,
            changeFrequency: "yearly" as const,
            priority: 0.3,
        })),
    ];

    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
        url: `${siteUrl}/magazin/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly",
        priority: 0.6,
        // pozele borcanelor apar și în Google Imagini
        images: p.images.map((i) => new URL(i.url, siteUrl).toString()),
    }));

    return [...staticRoutes, ...productRoutes];
}
