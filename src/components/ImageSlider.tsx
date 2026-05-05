"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export default function ImageSlider({ images, alt }: { images: string[]; alt: string }) {
    const safeImages = useMemo(() => (images?.length ? images : ["/og.jpg"]), [images]);
    const [i, setI] = useState(0);

    const prev = () => setI((x) => (x - 1 + safeImages.length) % safeImages.length);
    const next = () => setI((x) => (x + 1) % safeImages.length);

    return (
        <div className="rounded-3xl border border-yellow-500/15 bg-neutral-900/30 overflow-hidden">
            <div className="relative aspect-[4/3]">
                <Image
                    src={safeImages[i]}
                    alt={alt}
                    fill
                    // className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                />
            </div>

            {safeImages.length > 1 && (
                <div className="flex items-center justify-between gap-2 p-3">
                    <button
                        onClick={prev}
                        className="rounded-xl border border-yellow-500/25 px-4 py-2 text-sm hover:border-yellow-400/60"
                    >
                        ←
                    </button>

                    <div className="flex gap-2">
                        {safeImages.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setI(idx)}
                                className={`h-2.5 w-2.5 rounded-full border ${
                                    idx === i ? "bg-yellow-400 border-yellow-300" : "border-yellow-500/30"
                                }`}
                                aria-label={`Imagine ${idx + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={next}
                        className="rounded-xl border border-yellow-500/25 px-4 py-2 text-sm hover:border-yellow-400/60"
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    );
}