import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/db";
import { getOrCreateCart } from "@/lib/cart";
import CheckoutForm from "@/components/CheckoutForm";

export const dynamic = "force-dynamic";

const ERROR_MESSAGES: Record<string, string> = {
    date: "Completează email-ul, numele și telefonul (toate obligatorii).",
    adresa: "Completează adresa de livrare.",
    easybox: "Selectează un easybox pentru livrare.",
};

export default async function CheckoutPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const prisma = getPrisma();
    const session = await getServerSession(authOptions);
    const { error } = await searchParams;

    const cart = await getOrCreateCart(false);

    const items = cart
        ? await prisma.cartItem.findMany({
              where: { cartId: cart.id },
              include: { product: true },
              orderBy: { updatedAt: "desc" },
          })
        : [];

    if (items.length === 0) redirect("/cos");

    const totalRon = items.reduce((sum, it) => sum + it.qty * it.product.priceRon, 0);

    return (
        <main className="mx-auto max-w-6xl px-4 py-12">
            <h1 className="text-3xl font-black">Finalizare comandă</h1>
            <p className="mt-2 text-neutral-300">
                Plată ramburs la livrare. Nu ai nevoie de cont pentru a comanda.
            </p>

            <CheckoutForm
                items={items.map((it) => ({
                    id: it.id,
                    product: {
                        name: it.product.name,
                        weight: it.product.weight,
                        priceRon: it.product.priceRon,
                    },
                    qty: it.qty,
                }))}
                totalRon={totalRon}
                defaultEmail={session?.user?.email ?? ""}
                errorMessage={error ? ERROR_MESSAGES[error] ?? "Verifică datele introduse." : ""}
            />
        </main>
    );
}
