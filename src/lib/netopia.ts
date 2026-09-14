import { decodeProtectedHeader, importX509, jwtVerify } from "jose";

/**
 * Integrare NETOPIA Payments (API v2): plata cu cardul pe pagina securizată NETOPIA.
 *
 * Flux: startCardPayment -> clientul e redirecționat la paymentURL -> NETOPIA trimite
 * IPN (POST semnat JWT) la notifyUrl. Doar IPN-ul (sau interogarea de status) marchează
 * o comandă ca plătită - niciodată întoarcerea clientului pe site.
 *
 * Variabile de mediu:
 *  - NETOPIA_API_KEY        cheia API (admin NETOPIA -> Profil -> Securitate)
 *  - NETOPIA_POS_SIGNATURE  semnătura punctului de vânzare
 *  - NETOPIA_PUBLIC_CERT    certificatul public NETOPIA (PEM), pentru verificarea IPN
 *  - NETOPIA_LIVE           "true" în producție (implicit sandbox)
 *  - NETOPIA_BASE_URL       opțional, suprascrie URL-ul API
 */

const SANDBOX_BASE_URL = "https://secure-sandbox.netopia-payments.com";
const LIVE_BASE_URL = "https://secure.mobilpay.ro/pay";

// cod ISO 3166 numeric pentru România
const COUNTRY_RO = 642;

// cod de eroare din SDK-urile oficiale (E_VERIFICATION_FAILED_GENERAL)
const E_VERIFICATION_FAILED = 0x10000101;

/** Statusuri NETOPIA (payment.status) folosite de noi, conform SDK-urilor oficiale. */
export const NETOPIA_STATUS = {
    PAID: 3,
    CANCELED: 4,
    CONFIRMED: 5,
    CREDIT: 8,
    ERROR: 11,
    DECLINED: 12,
    EXPIRED: 23,
} as const;

type NetopiaConfig = {
    apiKey: string;
    posSignature: string;
    publicCert: string;
    baseUrl: string;
};

function getConfig(): NetopiaConfig | null {
    const apiKey = process.env.NETOPIA_API_KEY;
    const posSignature = process.env.NETOPIA_POS_SIGNATURE;
    const publicCert = process.env.NETOPIA_PUBLIC_CERT;
    if (!apiKey || !posSignature || !publicCert) return null;

    const baseUrl =
        process.env.NETOPIA_BASE_URL ||
        (process.env.NETOPIA_LIVE === "true" ? LIVE_BASE_URL : SANDBOX_BASE_URL);

    return {
        apiKey,
        posSignature,
        publicCert: normalizeCertificate(publicCert),
        baseUrl: baseUrl.replace(/\/$/, ""),
    };
}

/** Plata cu cardul apare pe site doar dacă NETOPIA e configurat. */
export function isCardPaymentEnabled(): boolean {
    return getConfig() !== null;
}

/** Acceptă certificatul pe o singură linie sau cu "\n" escapat (cum vine din variabile de mediu). */
function normalizeCertificate(value: string): string {
    const body = value
        .replace(/\\n/g, "")
        .replace(/-----(BEGIN|END) CERTIFICATE-----/g, "")
        .replace(/\s+/g, "");
    const lines = body.match(/.{1,64}/g) ?? [];
    return `-----BEGIN CERTIFICATE-----\n${lines.join("\n")}\n-----END CERTIFICATE-----`;
}

async function postJson<T>(cfg: NetopiaConfig, path: string, body: unknown) {
    const res = await fetch(`${cfg.baseUrl}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: cfg.apiKey,
        },
        body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => null)) as T | null;
    return { status: res.status, json };
}

export type NetopiaAddress = {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    city: string;
    county: string;
    postalCode: string;
    details: string;
};

function toNetopiaAddress(a: NetopiaAddress) {
    return {
        email: a.email,
        phone: a.phone,
        firstName: a.firstName,
        lastName: a.lastName,
        city: a.city,
        country: COUNTRY_RO,
        countryName: "Romania",
        state: a.county,
        postalCode: a.postalCode,
        details: a.details,
    };
}

export type StartCardPaymentInput = {
    // orderID trimis la NETOPIA (unic per încercare de plată)
    orderId: string;
    description: string;
    amountRon: number;
    notifyUrl: string;
    redirectUrl: string;
    billing: NetopiaAddress;
    shipping: NetopiaAddress;
    // price = valoarea liniei (cantitate x preț), astfel încât suma = amountRon
    products: Array<{ name: string; code: string; priceRon: number }>;
    browser: { userAgent?: string; ip?: string };
};

export type StartCardPaymentResult =
    | { ok: true; paymentUrl: string; ntpId: string | null }
    | { ok: false; error: string };

type StartPaymentResponse = {
    code?: string;
    message?: string;
    error?: { code?: string; message?: string };
    payment?: { paymentURL?: string; ntpID?: string; status?: number };
};

export async function startCardPayment(input: StartCardPaymentInput): Promise<StartCardPaymentResult> {
    const cfg = getConfig();
    if (!cfg) return { ok: false, error: "NETOPIA nu este configurat (lipsesc variabilele de mediu)" };

    const body = {
        config: {
            emailTemplate: "",
            emailSubject: "",
            notifyUrl: input.notifyUrl,
            redirectUrl: input.redirectUrl,
            language: "ro",
        },
        payment: {
            options: { installments: 0, bonus: 0 },
            // fără "instrument": clientul introduce datele cardului pe pagina NETOPIA
            data: {
                BROWSER_USER_AGENT: input.browser.userAgent ?? "",
                IP_ADDRESS: input.browser.ip ?? "",
            },
        },
        order: {
            ntpID: "",
            posSignature: cfg.posSignature,
            dateTime: new Date().toISOString(),
            description: input.description,
            orderID: input.orderId,
            amount: input.amountRon,
            currency: "RON",
            billing: toNetopiaAddress(input.billing),
            shipping: toNetopiaAddress(input.shipping),
            products: input.products.map((p) => ({
                name: p.name,
                code: p.code,
                category: "Miere",
                price: p.priceRon,
                vat: 0,
            })),
            installments: { selected: 0, available: [0] },
            data: {},
        },
    };

    try {
        const { status, json } = await postJson<StartPaymentResponse>(cfg, "/payment/card/start", body);
        const paymentUrl = json?.payment?.paymentURL;
        if (!paymentUrl) {
            const code = json?.error?.code ?? json?.code ?? "-";
            const reason = json?.error?.message || json?.message || "răspuns fără paymentURL";
            return { ok: false, error: `HTTP ${status} (cod ${code}): ${reason}` };
        }
        return { ok: true, paymentUrl, ntpId: json?.payment?.ntpID ?? null };
    } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
    }
}

type StatusResponse = {
    payment?: { status?: number; amount?: number };
};

/** Interoghează statusul unei plăți (autentificat cu cheia API - răspunsul e de încredere). */
export async function getPaymentStatus(
    ntpId: string,
    orderId: string,
): Promise<{ status: number; amount: number | null } | null> {
    const cfg = getConfig();
    if (!cfg) return null;

    const { json } = await postJson<StatusResponse>(cfg, "/operation/status", {
        posID: cfg.posSignature,
        ntpID: ntpId,
        orderID: orderId,
    });

    const status = json?.payment?.status;
    if (typeof status !== "number") return null;
    const amount = json?.payment?.amount;
    return { status, amount: typeof amount === "number" ? amount : null };
}

export type NetopiaIpn = {
    // orderID-ul trimis la NETOPIA
    orderId: string;
    ntpId: string | null;
    status: number;
    amount: number | null;
};

/**
 * Verifică un IPN: header-ul Verification-token e un JWT semnat RSA de NETOPIA, cu
 * iss = "NETOPIA Payments", aud = semnătura POS și sub = base64(sha512(body)).
 * Aruncă eroare dacă verificarea eșuează.
 */
export async function verifyIpn(verificationToken: string | null, rawBody: string): Promise<NetopiaIpn> {
    const cfg = getConfig();
    if (!cfg) throw new Error("NETOPIA nu este configurat");
    if (!verificationToken) throw new Error("lipsește header-ul Verification-token");

    const { alg } = decodeProtectedHeader(verificationToken);
    if (!alg || !["RS256", "RS384", "RS512"].includes(alg)) {
        throw new Error(`algoritm JWT neacceptat: ${alg}`);
    }

    const key = await importX509(cfg.publicCert, alg);
    const { payload } = await jwtVerify(verificationToken, key, {
        algorithms: [alg],
        issuer: "NETOPIA Payments",
        audience: cfg.posSignature,
    });

    const digest = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(rawBody));
    const bodyHash = btoa(String.fromCharCode(...new Uint8Array(digest)));
    if (payload.sub !== bodyHash) throw new Error("hash-ul body-ului nu corespunde cu sub din JWT");

    const data = JSON.parse(rawBody) as {
        order?: { orderID?: string; amount?: number };
        payment?: { status?: number; ntpID?: string; amount?: number };
    };

    const orderId = data.order?.orderID;
    const status = data.payment?.status;
    if (!orderId || typeof status !== "number") {
        throw new Error("IPN fără order.orderID / payment.status");
    }

    const amount = data.payment?.amount ?? data.order?.amount;
    return {
        orderId,
        status,
        ntpId: data.payment?.ntpID ?? null,
        amount: typeof amount === "number" ? amount : null,
    };
}

/** Răspunsul așteptat de NETOPIA la un IPN procesat. */
export const IPN_ACK = { errorType: 0, errorCode: null, errorMessage: "" };

/** "temporary" = NETOPIA reîncearcă IPN-ul mai târziu; "permanent" = nu mai reîncearcă. */
export function ipnError(kind: "temporary" | "permanent", message: string) {
    return {
        errorType: kind === "temporary" ? 1 : 2,
        errorCode: E_VERIFICATION_FAILED,
        errorMessage: message,
    };
}
