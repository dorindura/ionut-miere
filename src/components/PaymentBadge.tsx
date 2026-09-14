import type { PaymentMethod, PaymentStatus } from "@prisma/client";

type Tone = "paid" | "cash" | "pending" | "failed";

const TONE_CLASSES: Record<Tone, string> = {
    paid: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    cash: "border-yellow-500/30 bg-yellow-500/10 text-yellow-200",
    pending: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    failed: "border-red-500/30 bg-red-500/10 text-red-300",
};

export function paymentLabel(method: PaymentMethod, status: PaymentStatus): { label: string; tone: Tone } {
    if (method === "CASH_ON_DELIVERY") return { label: "Ramburs", tone: "cash" };

    switch (status) {
        case "PAID":
            return { label: "Plătit cu cardul", tone: "paid" };
        case "PENDING":
            return { label: "Card - plată în curs", tone: "pending" };
        case "CANCELLED":
            return { label: "Card - plată anulată", tone: "failed" };
        case "REFUNDED":
            return { label: "Card - rambursat", tone: "failed" };
        default:
            return { label: "Card - plată eșuată", tone: "failed" };
    }
}

export default function PaymentBadge({ method, status }: { method: PaymentMethod; status: PaymentStatus }) {
    const { label, tone } = paymentLabel(method, status);

    return (
        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${TONE_CLASSES[tone]}`}>
            {label}
        </span>
    );
}
