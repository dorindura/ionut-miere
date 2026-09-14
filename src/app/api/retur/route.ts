import { NextResponse } from "next/server";
import { sendWithdrawalEmails } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Formularul online de retragere (OUG 34/2014). */
export async function POST(req: Request) {
    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Cerere invalidă" }, { status: 400 });
    }

    const field = (key: string) => String(body?.[key] ?? "").trim().slice(0, 2000);

    const request = {
        fullName: field("fullName"),
        email: field("email").toLowerCase(),
        phone: field("phone"),
        orderId: field("orderId"),
        products: field("products"),
        receivedDate: field("receivedDate"),
        iban: field("iban"),
        details: field("details"),
    };

    if (!request.fullName || !EMAIL_RE.test(request.email) || !request.orderId || !request.products) {
        return NextResponse.json({ error: "Completează câmpurile obligatorii" }, { status: 400 });
    }

    // cererea există doar ca email -> dacă nu a plecat, clientul trebuie să afle
    const sent = await sendWithdrawalEmails(request);
    if (!sent) {
        return NextResponse.json({ error: "Trimiterea a eșuat" }, { status: 503 });
    }

    return NextResponse.json({ success: true });
}
