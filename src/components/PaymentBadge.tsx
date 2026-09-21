import type { PaymentMethod, PaymentStatus } from "@prisma/client";

type Tone = "paid" | "cash" | "pending" | "failed";

const TONE_CLASSES: Record<Tone, string> = {
    paid: "bg-hive-leaf/12 text-hive-leaf",
    cash: "bg-hive-sun/35 text-[#6b4d00]",
    pending: "bg-hive-blue/12 text-hive-blue",
    failed: "bg-hive-red/12 text-hive-red",
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

    return <span className={`chip ${TONE_CLASSES[tone]}`}>{label}</span>;
}
