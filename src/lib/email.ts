import { Resend } from "resend";

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
    createdAt: Date;
    deliveryMethod: "ADDRESS" | "EASYBOX";
    address?: string | null;
    easyboxName?: string | null;
    easyboxAddress?: string | null;
    easyboxCity?: string | null;
    easyboxCounty?: string | null;
    easyboxPostalCode?: string | null;
    items: OrderEmailItem[];
};

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
    return `<strong>Livrare la adresă</strong><br/>${escapeHtml(order.address || "")}`;
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

function shellHtml(title: string, intro: string, order: OrderEmailData): string {
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
            <td style="padding:14px 0 0;color:#fafafa;font-weight:700;">Total</td>
            <td style="padding:14px 0 0;text-align:right;color:#f5c518;font-size:18px;font-weight:800;">${order.totalRon} RON</td>
          </tr>
        </table>

        <div style="background:#0f0f0f;border:1px solid rgba(245,197,24,0.12);border-radius:14px;padding:16px;margin-top:8px;">
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
          Comandă #${escapeHtml(order.id.slice(-6))} • ${escapeHtml(dateFmt.format(order.createdAt))} • Plată ramburs la livrare.
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

    const ownerHtml = shellHtml(
        "Comandă nouă",
        `Ai primit o comandă nouă în valoare de <strong style="color:#f5c518;">${order.totalRon} RON</strong>. Detaliile sunt mai jos.`,
        order,
    );

    const customerHtml = shellHtml(
        "Îți mulțumim pentru comandă!",
        `Am înregistrat comanda ta. Te vom contacta telefonic pentru confirmare. Mai jos găsești sumarul.`,
        order,
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
                    subject: `Comandă nouă #${order.id.slice(-6)} - ${order.totalRon} RON`,
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
