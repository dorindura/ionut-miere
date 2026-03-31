import Link from "next/link";
import Image from "next/image";
import type { Products } from "@/lib/products";

export default function ProductCard({ p }: { p: Products }) {
    return (
        <article className="group overflow-hidden rounded-3xl border border-yellow-500/15 bg-neutral-900/30">
            <div className="relative h-64">
                <Image
                    src={p.images[0]}
                    alt={`${p.name} ${p.weight}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute left-4 top-4 rounded-full bg-neutral-950/70 px-3 py-1 text-xs text-yellow-200 border border-yellow-500/20">
          {p.weight}
        </span>
            </div>

            <div className="p-5">
                <h3 className="text-lg font-bold">{p.name}</h3>
                <p className="mt-1 text-sm text-neutral-300">{p.shortDescription}</p>

                <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-neutral-200">
            <span className="text-yellow-300 font-semibold">{p.priceRon} RON</span>
          </span>

                    <Link
                        href={`/magazin/${p.slug}`}
                        className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-yellow-400 transition-colors"
                    >
                        Vezi produs
                    </Link>
                </div>
            </div>
        </article>
    );
}