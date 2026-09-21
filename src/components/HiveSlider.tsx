"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Icon from "@/components/Icon";

/**
 * Rândul de stupi ca slider: pe telefon se glisează, pe desktop se folosesc săgețile.
 * Pista e un simplu scroll orizontal cu snap — funcționează și fără JavaScript.
 */
export default function HiveSlider({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    const trackRef = useRef<HTMLUListElement>(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);
    const items = Children.toArray(children);

    const update = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        setCanPrev(el.scrollLeft > 4);
        setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }, []);

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        update();
        el.addEventListener("scroll", update, { passive: true });
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => {
            el.removeEventListener("scroll", update);
            ro.disconnect();
        };
    }, [update]);

    const step = (dir: 1 | -1) => {
        const el = trackRef.current;
        if (!el) return;
        const first = el.querySelector("li");
        const cardWidth = first ? first.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
        // cât încap pe ecran, minus unul, ca ultimul stup vizibil să rămână ca reper
        const perView = Math.max(1, Math.floor(el.clientWidth / cardWidth) - 1);
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollBy({ left: dir * cardWidth * perView, behavior: reduce ? "auto" : "smooth" });
    };

    const hasOverflow = canPrev || canNext;

    return (
        <div>
            <div className="mx-auto flex max-w-6xl items-end justify-between gap-4 px-4">
                <h2 className="text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-[1.02]">{label}</h2>
                <div className={`hidden gap-2 md:flex ${hasOverflow ? "" : "md:invisible"}`}>
                    <button
                        type="button"
                        onClick={() => step(-1)}
                        disabled={!canPrev}
                        aria-label="Sortimentele anterioare"
                        className="grid h-12 w-12 place-items-center rounded-full border-[1.5px] border-ink bg-paper text-ink transition-colors hover:bg-ink hover:text-wash disabled:cursor-not-allowed disabled:border-rule-strong disabled:bg-transparent disabled:text-ink-3"
                    >
                        <Icon name="arrowLeft" size={20} />
                    </button>
                    <button
                        type="button"
                        onClick={() => step(1)}
                        disabled={!canNext}
                        aria-label="Sortimentele următoare"
                        className="grid h-12 w-12 place-items-center rounded-full border-[1.5px] border-ink bg-paper text-ink transition-colors hover:bg-ink hover:text-wash disabled:cursor-not-allowed disabled:border-rule-strong disabled:bg-transparent disabled:text-ink-3"
                    >
                        <Icon name="arrowRight" size={20} />
                    </button>
                </div>
            </div>

            <ul
                ref={trackRef}
                aria-label={label}
                className="no-scrollbar mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-0 pt-2 md:gap-6 [scroll-padding-inline:max(1rem,calc((100vw-72rem)/2+1rem))] [padding-inline:max(1rem,calc((100vw-72rem)/2+1rem))]"
            >
                {items.map((child, i) => (
                    <li key={i} className="flex w-[74vw] max-w-[290px] shrink-0 snap-start md:w-[268px]">
                        {child}
                    </li>
                ))}
            </ul>
        </div>
    );
}
