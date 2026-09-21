"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Icon from "@/components/Icon";

export default function ImageSlider({ images, alt }: { images: string[]; alt: string }) {
    const safeImages = useMemo(() => images?.filter(Boolean) ?? [], [images]);
    const [i, setI] = useState(0);
    const count = safeImages.length;

    const prev = () => setI((x) => (x - 1 + count) % count);
    const next = () => setI((x) => (x + 1) % count);

    return (
        <div>
            <div className="hive-window aspect-[4/5]">
                {count > 0 ? (
                    <Image
                        key={safeImages[i]}
                        src={safeImages[i]}
                        alt={count > 1 ? `${alt} (imaginea ${i + 1} din ${count})` : alt}
                        fill
                        sizes="(max-width: 768px) 92vw, 45vw"
                        priority
                        className="object-contain p-3"
                    />
                ) : (
                    <div className="grid h-full place-items-center text-ink-3">
                        <Icon name="jar" size={64} />
                    </div>
                )}
            </div>

            {count > 1 && (
                <div className="mt-3 flex items-center justify-between gap-2">
                    <button
                        type="button"
                        onClick={prev}
                        aria-label="Imaginea anterioară"
                        className="grid h-11 w-11 place-items-center rounded-lg bg-white/90 text-ink hover:bg-white"
                    >
                        <Icon name="arrowLeft" size={20} />
                    </button>

                    <div className="flex gap-2">
                        {safeImages.map((_, idx) => (
                            <button
                                type="button"
                                key={idx}
                                onClick={() => setI(idx)}
                                className="grid h-8 w-8 place-items-center"
                                aria-label={`Imaginea ${idx + 1}`}
                                aria-current={idx === i}
                            >
                                <span
                                    className={`h-2.5 rounded-full transition-all ${
                                        idx === i ? "w-6 bg-white" : "w-2.5 bg-white/50"
                                    }`}
                                />
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={next}
                        aria-label="Imaginea următoare"
                        className="grid h-11 w-11 place-items-center rounded-lg bg-white/90 text-ink hover:bg-white"
                    >
                        <Icon name="arrowRight" size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}
