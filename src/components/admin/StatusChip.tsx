import type { OrderStatus } from "@prisma/client";
import { ORDER_STATUS } from "@/lib/hive";

export default function StatusChip({ status }: { status: OrderStatus }) {
    const s = ORDER_STATUS[status];
    return <span className={`chip ${s.className}`}>{s.label}</span>;
}
