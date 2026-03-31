import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function MagazinPage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-12">
            <h1 className="text-3xl font-black">Magazin</h1>
            <p className="mt-2 text-neutral-300">
                Alege sortimentul preferat. Livrare rapidă, ambalare sigură.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
                {products.map((p) => (
                    <ProductCard key={p.id} p={p} />
                ))}
            </div>
        </main>
    );
}