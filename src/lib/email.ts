import { Resend } from "resend";
import { EASYBOX_CARD_ONLY_NOTE } from "@/lib/shipping";
import { COMPANY } from "@/lib/company";

const FROM = "Prisaca Apuseni <contact@prisaca-apuseni.com>";
const OWNER_EMAIL = "buceadariusionut@gmail.com";

let resend: Resend | null = null;
function getResend(): Resend | null {
    if (!process.env.RESEND_API_KEY) return null;
    if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
    return resend;
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export type OrderEmailItem = {
    name: string;
    weight: string;
    priceRon: number;
    qty: number;
};

export type OrderEmailData = {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    totalRon: number;
    shippingRon: number;
    createdAt: Date;
    deliveryMethod: "ADDRESS" | "EASYBOX";
    paymentMethod: "CASH_ON_DELIVERY" | "CARD";
    address?: string | null;
    city?: string | null;
    county?: string | null;
    postalCode?: string | null;
    easyboxName?: string | null;
    easyboxAddress?: string | null;
    easyboxCity?: string | null;
    easyboxCounty?: string | null;
    easyboxPostalCode?: string | null;
    items: OrderEmailItem[];
};

type Audience = "owner" | "customer";

const dateFmt = new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Bucharest",
});

function deliveryHtml(order: OrderEmailData): string {
    if (order.deliveryMethod === "EASYBOX") {
        const lines = [
            order.easyboxName,
            order.easyboxAddress,
            [order.easyboxCity, order.easyboxCounty, order.easyboxPostalCode]
                .filter(Boolean)
                .join(", "),
        ]
            .filter(Boolean)
            .map((l) => escapeHtml(String(l)))
            .join("<br/>");
        return `<strong>Easybox</strong><br/>${lines}`;
    }
    const lines = [order.address, [order.city, order.county, order.postalCode].filter(Boolean).join(", ")]
        .filter(Boolean)
        .map((l) => escapeHtml(String(l)))
        .join("<br/>");
    return `<strong>Livrare la adresă</strong><br/>${lines}`;
}

function paymentHtml(order: OrderEmailData, audience: Audience): string {
    if (order.paymentMethod === "CARD") {
        return audience === "owner"
            ? `<strong style="color:#4ade80;">Plătită online cu cardul.</strong><br/>NU pune ramburs la AWB (easybox / curier).`
            : `<strong style="color:#4ade80;">Plătită online cu cardul.</strong><br/>Nu mai ai nimic de plătit la livrare.`;
    }

    const toCollect =
        audience === "owner"
            ? `<strong>Ramburs:</strong> încasează ${order.totalRon} RON la livrare (setează rambursul la AWB).`
            : `<strong>Ramburs la livrare:</strong> ${order.totalRon} RON.`;
    const easyboxNote =
        order.deliveryMethod === "EASYBOX"
            ? `<br/><span style="color:#f5c518;">${EASYBOX_CARD_ONLY_NOTE}</span>`
            : "";
    return toCollect + easyboxNote;
}

function itemsRowsHtml(order: OrderEmailData): string {
    return order.items
        .map(
            (it) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;color:#e5e5e5;">
            ${escapeHtml(it.name)}<br/>
            <span style="color:#9a9a9a;font-size:12px;">${escapeHtml(it.weight)} • ${it.qty} buc × ${it.priceRon} RON</span>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;text-align:right;color:#f5c518;font-weight:700;white-space:nowrap;">
            ${it.qty * it.priceRon} RON
          </td>
        </tr>`,
        )
        .join("");
}

function shellHtml(title: string, intro: string, order: OrderEmailData, audience: Audience): string {
    return `
  <div style="background:#0a0a0a;padding:24px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#141414;border:1px solid rgba(245,197,24,0.18);border-radius:20px;overflow:hidden;">
      <div style="padding:24px 28px;border-bottom:1px solid rgba(245,197,24,0.12);">
        <p style="margin:0;color:#f5c518;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Prisaca Apuseni</p>
        <h1 style="margin:6px 0 0;color:#fafafa;font-size:22px;">${escapeHtml(title)}</h1>
      </div>
      <div style="padding:24px 28px;color:#d4d4d4;font-size:14px;line-height:1.6;">
        <p style="margin:0 0 16px;">${intro}</p>

        <table style="width:100%;border-collapse:collapse;margin:8px 0 16px;">
          ${itemsRowsHtml(order)}
          <tr>
            <td style="padding:12px 0 0;color:#d4d4d4;">Livrare (${order.deliveryMethod === "EASYBOX" ? "easybox" : "la adresă"})</td>
            <td style="padding:12px 0 0;text-align:right;color:#e5e5e5;font-weight:700;white-space:nowrap;">${order.shippingRon} RON</td>
          </tr>
          <tr>
            <td style="padding:14px 0 0;color:#fafafa;font-weight:700;">Total</td>
            <td style="padding:14px 0 0;text-align:right;color:#f5c518;font-size:18px;font-weight:800;">${order.totalRon} RON</td>
          </tr>
        </table>

        <div style="background:#0f0f0f;border:1px solid rgba(245,197,24,0.12);border-radius:14px;padding:16px;margin-top:8px;">
          <p style="margin:0 0 8px;color:#f5c518;font-weight:700;font-size:13px;">Plată</p>
          <p style="margin:0;color:#d4d4d4;">${paymentHtml(order, audience)}</p>
        </div>

        <div style="background:#0f0f0f;border:1px solid rgba(245,197,24,0.12);border-radius:14px;padding:16px;margin-top:12px;">
          <p style="margin:0 0 8px;color:#f5c518;font-weight:700;font-size:13px;">Detalii livrare</p>
          <p style="margin:0;color:#d4d4d4;">${deliveryHtml(order)}</p>
        </div>

        <div style="background:#0f0f0f;border:1px solid rgba(245,197,24,0.12);border-radius:14px;padding:16px;margin-top:12px;">
          <p style="margin:0 0 8px;color:#f5c518;font-weight:700;font-size:13px;">Date contact</p>
          <p style="margin:0;color:#d4d4d4;">
            ${escapeHtml(order.fullName)}<br/>
            ${escapeHtml(order.email)}<br/>
            ${escapeHtml(order.phone)}
          </p>
        </div>

        <p style="margin:18px 0 0;color:#8a8a8a;font-size:12px;">
          Comandă #${escapeHtml(order.id.slice(-6))} • ${escapeHtml(dateFmt.format(order.createdAt))} • ${order.paymentMethod === "CARD" ? "Plătită cu cardul." : "Plată ramburs la livrare."}
        </p>
      </div>
    </div>
  </div>`;
}

/**
 * Trimite emailurile aferente unei comenzi:
 *  - notificare către proprietar (cu toate detaliile)
 *  - confirmare către client (dacă a fost completat un email valid)
 *
 * Nu aruncă erori: dacă trimiterea eșuează, comanda rămâne plasată.
 */
export async function sendOrderEmails(order: OrderEmailData): Promise<void> {
    const client = getResend();
    if (!client) {
        console.warn("[email] RESEND_API_KEY lipsește - nu se trimit emailuri pentru comanda", order.id);
        return;
    }

    const isCard = order.paymentMethod === "CARD";

    const ownerHtml = shellHtml(
        isCard ? "Comandă nouă - plătită cu cardul" : "Comandă nouă - ramburs",
        isCard
            ? `Ai primit o comandă nouă, <strong style="color:#4ade80;">plătită online cu cardul</strong>, în valoare de <strong style="color:#f5c518;">${order.totalRon} RON</strong>. Detaliile sunt mai jos.`
            : `Ai primit o comandă nouă cu plata ramburs, în valoare de <strong style="color:#f5c518;">${order.totalRon} RON</strong>. Detaliile sunt mai jos.`,
        order,
        "owner",
    );

    const customerHtml = shellHtml(
        "Îți mulțumim pentru comandă!",
        isCard
            ? `Plata cu cardul a fost confirmată și am înregistrat comanda ta. Mai jos găsești sumarul.`
            : `Am înregistrat comanda ta. Te vom contacta telefonic pentru confirmare. Mai jos găsești sumarul.`,
        order,
        "customer",
    );

    // un singur apel: notificare proprietar + confirmare client (dacă emailul e valid)
    const recipients = [OWNER_EMAIL];
    const sendCustomer =
        order.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.email) && order.email !== OWNER_EMAIL;

    const tasks: Array<{ label: string; run: () => Promise<{ data: unknown; error: unknown }> }> = [
        {
            label: "proprietar",
            run: () =>
                client.emails.send({
                    from: FROM,
                    to: recipients,
                    replyTo: order.email || undefined,
                    subject: `Comandă nouă #${order.id.slice(-6)} - ${order.totalRon} RON - ${isCard ? "PLĂTITĂ CU CARDUL" : "RAMBURS"}`,
                    html: ownerHtml,
                }),
        },
    ];

    if (sendCustomer) {
        tasks.push({
            label: "client",
            run: () =>
                client.emails.send({
                    from: FROM,
                    to: [order.email],
                    subject: `Confirmare comandă #${order.id.slice(-6)} - Prisaca Apuseni`,
                    html: customerHtml,
                }),
        });
    }

    for (const task of tasks) {
        try {
            const { data, error } = await task.run();
            if (error) {
                // Resend NU aruncă excepție la refuz - eroarea vine în câmpul `error`
                console.error(`[email] Resend a respins emailul (${task.label}) pentru comanda ${order.id}:`, error);
            } else {
                console.log(`[email] trimis ok (${task.label}) pentru comanda ${order.id}:`, data);
            }
        } catch (e) {
            console.error(`[email] excepție la trimitere (${task.label}) pentru comanda ${order.id}:`, e);
        }
    }
}

export type WithdrawalRequest = {
    fullName: string;
    email: string;
    phone: string;
    orderId: string;
    products: string;
    receivedDate: string;
    iban: string;
    details: string;
};

function simpleShellHtml(title: string, bodyHtml: string): string {
    return `
  <div style="background:#0a0a0a;padding:24px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#141414;border:1px solid rgba(245,197,24,0.18);border-radius:20px;overflow:hidden;">
      <div style="padding:24px 28px;border-bottom:1px solid rgba(245,197,24,0.12);">
        <p style="margin:0;color:#f5c518;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Prisaca Apuseni</p>
        <h1 style="margin:6px 0 0;color:#fafafa;font-size:22px;">${escapeHtml(title)}</h1>
      </div>
      <div style="padding:24px 28px;color:#d4d4d4;font-size:14px;line-height:1.6;">${bodyHtml}</div>
    </div>
  </div>`;
}

/**
 * Cerere de retragere (OUG 34/2014): notificare către proprietar + confirmare de primire către
 * client pe suport durabil (email) - obligatorie când cererea vine prin formularul online.
 * Întoarce false dacă notificarea către proprietar nu a putut fi trimisă.
 */
export async function sendWithdrawalEmails(req: WithdrawalRequest): Promise<boolean> {
    const client = getResend();
    if (!client) {
        console.warn("[email] RESEND_API_KEY lipsește - cererea de retragere nu poate fi trimisă");
        return false;
    }

    const receivedAt = dateFmt.format(new Date());
    const rows = (
        [
            ["Nume", req.fullName],
            ["Email", req.email],
            ["Telefon", req.phone || "—"],
            ["ID comandă", req.orderId],
            ["Produse returnate", req.products],
            ["Data primirii coletului", req.receivedDate || "—"],
            ["IBAN (ramburs)", req.iban || "—"],
            ["Alte detalii", req.details || "—"],
        ] as const
    )
        .map(
            ([label, value]) => `
        <tr>
          <td style="padding:6px 12px 6px 0;color:#9a9a9a;vertical-align:top;white-space:nowrap;">${label}</td>
          <td style="padding:6px 0;color:#e5e5e5;">${escapeHtml(value).replace(/\n/g, "<br/>")}</td>
        </tr>`,
        )
        .join("");
    const table = `<table style="width:100%;border-collapse:collapse;margin:8px 0 0;">${rows}</table>`;

    try {
        const { error } = await client.emails.send({
            from: FROM,
            to: [OWNER_EMAIL],
            replyTo: req.email,
            subject: `Cerere de retragere - comanda ${req.orderId}`,
            html: simpleShellHtml(
                "Cerere de retragere din contract",
                `<p style="margin:0 0 12px;">Un client a trimis o cerere de retragere prin formularul de pe site, la ${escapeHtml(receivedAt)}. Rambursarea trebuie făcută în cel mult 14 zile de la această dată.</p>${table}`,
            ),
        });
        if (error) {
            console.error("[email] Resend a respins cererea de retragere:", error);
            return false;
        }
    } catch (e) {
        console.error("[email] excepție la trimiterea cererii de retragere:", e);
        return false;
    }

    try {
        const { error } = await client.emails.send({
            from: FROM,
            to: [req.email],
            subject: `Confirmare cerere de retragere - comanda ${req.orderId}`,
            html: simpleShellHtml(
                "Am primit cererea ta de retragere",
                `<p style="margin:0 0 12px;">Confirmăm că am primit, la ${escapeHtml(receivedAt)}, cererea ta de retragere din contract pentru comanda <strong>${escapeHtml(req.orderId)}</strong>.</p>
                 <p style="margin:0 0 12px;">Te rugăm să trimiți produsele în cel mult 14 zile la adresa: <strong>${escapeHtml(COMPANY.returnAddress)}</strong>. Îți returnăm banii în cel mult 14 zile de la primirea cererii; putem amâna rambursarea până primim produsele sau dovada expedierii.</p>
                 <p style="margin:0 0 4px;color:#f5c518;font-weight:700;">Datele trimise</p>${table}`,
            ),
        });
        if (error) console.error("[email] Resend a respins confirmarea de retragere către client:", error);
    } catch (e) {
        console.error("[email] excepție la trimiterea confirmării de retragere către client:", e);
    }

    return true;
}
