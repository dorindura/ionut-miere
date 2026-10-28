/**
 * GA4 și Meta Pixel.
 *
 * Nu se încarcă nimic până când vizitatorul nu apasă „Accept" în bannerul de
 * cookie-uri (vezi `CookieConsent`): Politica de cookies promite că cerem acordul
 * înainte de orice cookie de analiză sau publicitate.
 *
 * Fără `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_FB_PIXEL_ID` nu se încarcă nimic și
 * bannerul nici nu apare — site-ul rămâne exact cum era.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID ?? "";

/** dacă nu e configurat niciun cod de măsurare, nu arătăm bannerul */
export const ANALYTICS_CONFIGURED = Boolean(GA_ID || FB_PIXEL_ID);

/** alegerea vizitatorului, ținută în localStorage */
export const CONSENT_KEY = "pa-consent";
/** evenimentul pe care îl ascultă `Analytics` ca să pornească scripturile imediat după „Accept" */
export const CONSENT_EVENT = "pa-consent-change";

export type ConsentChoice = "granted" | "denied";

declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
        fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void };
    }
}

export function readConsent(): ConsentChoice | null {
    if (typeof window === "undefined") return null;
    try {
        const v = window.localStorage.getItem(CONSENT_KEY);
        return v === "granted" || v === "denied" ? v : null;
    } catch {
        // navigare privată sau cookie-uri blocate: tratăm ca „încă nu a ales"
        return null;
    }
}

export function writeConsent(choice: ConsentChoice) {
    try {
        window.localStorage.setItem(CONSENT_KEY, choice);
    } catch {
        // dacă nu putem scrie, alegerea ține doar cât ține pagina
    }
    window.dispatchEvent(new Event(CONSENT_EVENT));
}

/** un borcan, așa cum îl trimitem la GA4 și la Meta */
export type TrackItem = {
    slug: string;
    name: string;
    weight: string;
    priceRon: number;
    qty?: number;
};

function gaItems(items: TrackItem[]) {
    return items.map((it) => ({
        item_id: it.slug,
        item_name: it.name,
        item_variant: it.weight,
        price: it.priceRon,
        quantity: it.qty ?? 1,
    }));
}

function fbContents(items: TrackItem[]) {
    return items.map((it) => ({ id: it.slug, quantity: it.qty ?? 1, item_price: it.priceRon }));
}

function valueOf(items: TrackItem[]) {
    return items.reduce((sum, it) => sum + it.priceRon * (it.qty ?? 1), 0);
}

/** `true` doar după acord: altfel evenimentele se pierd intenționat, nu se pun la coadă */
function enabled() {
    return typeof window !== "undefined" && readConsent() === "granted";
}

/**
 * Evenimentele de la deschiderea paginii (`view_item`, `begin_checkout`, `purchase`)
 * pleacă înainte ca gtag.js și fbevents.js să apuce să se încarce. Reîncercăm
 * până apar, altfel comanda nu s-ar vedea deloc în rapoarte.
 */
const RETRY_MS = 200;
const RETRY_LIMIT = 50; // ~10 secunde

function deliver(attempt: () => boolean) {
    if (attempt()) return;
    let tries = 0;
    const id = window.setInterval(() => {
        if (attempt() || ++tries >= RETRY_LIMIT) window.clearInterval(id);
    }, RETRY_MS);
}

function send(gaEvent: string, gaParams: Record<string, unknown>, fbEvent: string, fbParams: Record<string, unknown>) {
    if (!enabled()) return;
    deliver(() => {
        if (GA_ID && typeof window.gtag !== "function") return false;
        if (FB_PIXEL_ID && typeof window.fbq !== "function") return false;
        window.gtag?.("event", gaEvent, gaParams);
        window.fbq?.("track", fbEvent, fbParams);
        return true;
    });
}

export function trackViewItem(item: TrackItem) {
    const items = [item];
    send(
        "view_item",
        { currency: "RON", value: valueOf(items), items: gaItems(items) },
        "ViewContent",
        { currency: "RON", value: valueOf(items), content_type: "product", content_ids: [item.slug] },
    );
}

export function trackAddToCart(item: TrackItem) {
    const items = [item];
    send(
        "add_to_cart",
        { currency: "RON", value: valueOf(items), items: gaItems(items) },
        "AddToCart",
        {
            currency: "RON",
            value: valueOf(items),
            content_type: "product",
            content_ids: [item.slug],
            contents: fbContents(items),
        },
    );
}

export function trackBeginCheckout(items: TrackItem[], valueRon: number) {
    send(
        "begin_checkout",
        { currency: "RON", value: valueRon, items: gaItems(items) },
        "InitiateCheckout",
        {
            currency: "RON",
            value: valueRon,
            content_type: "product",
            content_ids: items.map((it) => it.slug),
            contents: fbContents(items),
            num_items: items.reduce((n, it) => n + (it.qty ?? 1), 0),
        },
    );
}

export function trackPurchase({
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
    send(
        "purchase",
        {
            transaction_id: orderId,
            currency: "RON",
            value: valueRon,
            shipping: shippingRon,
            items: gaItems(items),
        },
        "Purchase",
        {
            currency: "RON",
            value: valueRon,
            content_type: "product",
            content_ids: items.map((it) => it.slug),
            contents: fbContents(items),
        },
    );
}
