import bcrypt from "bcrypt";
import { prisma } from "../src/lib/prisma";
import { products } from "../src/lib/products";

async function seedAdmin() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env");
    }

    const hash = await bcrypt.hash(password, 12);

    await prisma.user.upsert({
        where: { email },
        update: { password: hash, role: "ADMIN" },
        create: { email, password: hash, role: "ADMIN" },
    });

    console.log("✅ Admin ready:", email);
}

async function seedProducts() {
    for (const p of products) {
        // Product: map details Json fields
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

        // reset images then re-add
        await prisma.productImage.deleteMany({ where: { productId: created.id } });

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

async function main() {
    await seedAdmin();
    await seedProducts();
}

main()
    .then(async () => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });