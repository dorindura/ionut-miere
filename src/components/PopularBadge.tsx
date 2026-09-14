export default function PopularBadge({ className = "" }: { className?: string }) {
    return (
        <span
            className={`inline-flex rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-neutral-950 ${className}`}
        >
            ★ Popular
        </span>
    );
}
