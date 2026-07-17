import type { MetadataRoute } from "next";
import { getPrisma } from "@/lib/db";

const siteUrl = "https://prisaca-apuseni.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const prisma = getPrisma();

    const products = await prisma.product.findMany({
        select: { slug: true, updatedAt: true },
    });

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: siteUrl, changeFrequency: "weekly", priority: 1 },
        { url: `${siteUrl}/magazin`, changeFrequency: "weekly", priority: 0.8 },
    ];

    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
        url: `${siteUrl}/magazin/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly",
        priority: 0.6,
    }));

    return [...staticRoutes, ...productRoutes];
}
