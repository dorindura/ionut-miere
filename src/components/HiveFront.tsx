import Image from "next/image";
import type { ReactNode } from "react";
import { hiveNumber, hiveStyle, type HivePaint } from "@/lib/hive";
import Icon from "@/components/Icon";

/** cadrul unui stup pictat: capac, corp vopsit, urdiniș cu scândurică */
export function HiveFrame({
    paint,
    className = "",
    children,
}: {
    paint: HivePaint;
    className?: string;
    children: ReactNode;
}) {
    return (
        <div className={`hive ${className}`} style={hiveStyle(paint)}>
            <div className="hive-lid" />
            <div className="hive-body">
                {children}
                <div className="hive-entrance" aria-hidden />
            </div>
        </div>
    );
}

export function HivePlateRow({ number, popular }: { number: number; popular?: boolean }) {
    return (
        <div className="mb-3 flex items-center justify-between gap-2">
            <span className="plate">{hiveNumber(number)}</span>
            {popular ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[0.78rem] font-bold text-ink">
                    <Icon name="star" size={13} className="fill-hive-sun text-[#8a6400]" />
                    Popular
                </span>
            ) : null}
        </div>
    );
}

export function HiveWindow({
    src,
    alt,
    sizes,
    priority,
    soldOut,
    aspect = "aspect-[4/5]",
}: {
    src?: string;
    alt: string;
    sizes: string;
    priority?: boolean;
    soldOut?: boolean;
    aspect?: string;
}) {
    return (
        <div className={`hive-window ${aspect}`}>
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes={sizes}
                    priority={priority}
                    className={`object-contain p-2 ${soldOut ? "opacity-50 grayscale" : ""}`}
                />
            ) : (
                <div className="grid h-full place-items-center text-ink-3">
                    <Icon name="jar" size={48} />
                </div>
            )}
        </div>
    );
}
