import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/db";
import CheckoutForm from "@/components/CheckoutForm";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
    const prisma = getPrisma();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) redirect("/cont/login");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { cart: { include: { items: { include: { product: true } } } } },
    });

    const items = user?.cart?.items ?? [];

    if (items.length === 0) redirect("/cos");

    const totalRon = items.reduce((sum, it) => sum + it.qty * it.product.priceRon, 0);

    return (
        <main className="mx-auto max-w-6xl px-4 py-12">
            <h1 className="text-3xl font-black">Checkout</h1>
            <p className="mt-2 text-neutral-300">Plată ramburs la livrare.</p>

            <CheckoutForm items={items} totalRon={totalRon} />
        </main>
    );
}