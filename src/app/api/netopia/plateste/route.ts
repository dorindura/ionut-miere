import { NextResponse } from "next/server";
import { startOrderCardPayment } from "@/lib/orders";

/** Reîncearcă plata cu cardul pentru o comandă neplătită (buton "Plătește acum"). */
export async function POST(req: Request) {
    const form = await req.formData();
    const orderId = String(form.get("orderId") || "").trim();

    if (!orderId) return NextResponse.redirect(new URL("/", req.url), 303);

    const paymentUrl = await startOrderCardPayment(orderId, req);

    return NextResponse.redirect(
        paymentUrl ?? new URL(`/comanda/${orderId}?plata=eroare`, req.url),
        303,
    );
}
