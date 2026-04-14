import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { products } from "@/lib/products";

const prisma = new PrismaClient({
    log: ["error"],
});

async function main() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD");
    }

    const hash = await bcrypt.hash(password, 12);

    await prisma.user.upsert({
        where: { email },
        update: { password: hash, role: "ADMIN" },
        create: { email, password: hash, role: "ADMIN" },
    });

    console.log("✅ Admin ready:", email);

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

        console.log("✅ Seeded product:", created.slug);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });