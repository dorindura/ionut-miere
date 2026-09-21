import { getPrisma } from "@/lib/db";
import { groupByVariety } from "@/lib/hive";

/**
 * Sortimentele din DB, grupate pe nume. Numărul stupului („Nr. 01") urmează ordinea
 * adăugării, ca să rămână același; afișarea pune sortimentele populare primele.
 */
export async function getVarieties() {
    const prisma = getPrisma();

    const products = await prisma.product.findMany({
        orderBy: [{ createdAt: "asc" }, { slug: "asc" }],
        include: {
            images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
    });

    return groupByVariety(products).sort((a, b) => Number(b.popular) - Number(a.popular));
}

export type VarietyWithProducts = Awaited<ReturnType<typeof getVarieties>>[number];
