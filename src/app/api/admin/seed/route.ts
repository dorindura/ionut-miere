import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getPrisma } from "@/lib/db";
import { products } from "@/lib/products";

type SeedBody = {
    secret?: string;
};

export async function POST(request: Request) {
    try {
        const prisma = getPrisma();

        const body = (await request.json().catch(() => ({}))) as SeedBody;
        const secret = body.secret;

        if (secret !== process.env.NEXTAUTH_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Missing ADMIN_EMAIL or ADMIN_PASSWORD" },
                { status: 500 }
            );
        }

        const hash = await bcrypt.hash(password, 12);

        await prisma.user.upsert({
            where: { email },
            update: { password: hash, role: "ADMIN" },
            create: { email, password: hash, role: "ADMIN" },
        });

        for (const p of products) {
            const created = await prisma.product.upsert({
                where: { slug: p.slug },
                update: {
                    name: p.name,
                    shortDescription: p.shortDescription,
                    description: p.description,
                    priceRon: p.priceRon,
                    weight: p.weight,
                    inStock: p.inStock,
                    origin: p.details.origin ?? null,
                    howItsMade: p.details.howItsMade ?? null,
                    characteristics: p.details.characteristics,
                    benefits: p.details.benefits,
                    consumption: p.details.consumption,
                },
                create: {
                    slug: p.slug,
                    name: p.name,
                    shortDescription: p.shortDescription,
                    description: p.description,
                    priceRon: p.priceRon,
                    weight: p.weight,
                    inStock: p.inStock,
                    origin: p.details.origin ?? null,
                    howItsMade: p.details.howItsMade ?? null,
                    characteristics: p.details.characteristics,
                    benefits: p.details.benefits,
                    consumption: p.details.consumption,
                },
                select: { id: true, slug: true },
            });

            await prisma.productImage.deleteMany({
                where: { productId: created.id },
            });

            await prisma.productImage.createMany({
                data: p.images.map((url, idx) => ({
                    url,
                    alt: `${p.name} ${p.weight}`,
                    sortOrder: idx,
                    productId: created.id,
                })),
            });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Seed failed" }, { status: 500 });
    }
}