import { NextResponse } from "next/server";
import { IPN_ACK, ipnError, verifyIpn } from "@/lib/netopia";
import { applyNetopiaPayment } from "@/lib/orders";

/** IPN NETOPIA: notificare server-to-server cu rezultatul plății. */
export async function POST(req: Request) {
    // body-ul brut e necesar pentru verificarea hash-ului din JWT
    const rawBody = await req.text();

    let ipn;
    try {
        ipn = await verifyIpn(req.headers.get("Verification-token"), rawBody);
    } catch (e) {
        console.error("[netopia] IPN respins la verificare:", e);
        return NextResponse.json(ipnError("permanent", "verificarea IPN a eșuat"));
    }

    try {
        await applyNetopiaPayment(ipn);
    } catch (e) {
        // eroare la noi (ex. DB) -> NETOPIA reîncearcă mai târziu
        console.error(`[netopia] eroare la procesarea IPN pentru ${ipn.orderId}:`, e);
        return NextResponse.json(ipnError("temporary", "eroare internă, reîncearcă"));
    }

    return NextResponse.json(IPN_ACK);
}
