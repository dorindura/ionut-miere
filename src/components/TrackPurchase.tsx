"use client";

import { useEffect } from "react";
import { trackPurchase, type TrackItem } from "@/lib/analytics";

/**
 * Trimite `purchase` / `Purchase` pe pagina de confirmare.
 *
 * Clientul poate reîncărca pagina (mai ales după întoarcerea de la NETOPIA),
 * așa că ținem minte comenzile deja raportate și nu le numărăm de două ori.
 */
export default function TrackPurchase({
    orderId,
    items,
    valueRon,
    shippingRon,
}: {
    orderId: string;
    items: TrackItem[];
    valueRon: number;
    shippingRon: number;
}) {
    useEffect(() => {
        const key = `pa-purchase-${orderId}`;
        try {
            if (window.localStorage.getItem(key)) return;
            window.localStorage.setItem(key, "1");
        } catch {
            // fără localStorage riscăm un dublu raport la reîncărcare, dar nu pierdem comanda
        }
        trackPurchase({ orderId, items, valueRon, shippingRon });
        // o singură dată per comandă
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    return null;
}
