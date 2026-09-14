import type { PaymentStatus } from "@prisma/client";
import { getPrisma } from "@/lib/db";
import { sendOrderEmails } from "@/lib/email";
import {
    getPaymentStatus,
    NETOPIA_STATUS,
    startCardPayment,
    type NetopiaAddress,
    type NetopiaIpn,
} from "@/lib/netopia";

/** Trimite emailurile comenzii (proprietar + client). Nu aruncă erori. */
export async function sendOrderEmailsById(orderId: string): Promise<void> {
    const prisma = getPrisma();

    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true },
        });
        if (!order) return;

        await sendOrderEmails({
            id: order.id,
            email: order.email,
            fullName: order.fullName ?? "",
            phone: order.phone ?? "",
            totalRon: order.totalRon,
            shippingRon: order.shippingRon,
            createdAt: order.createdAt,
            deliveryMethod: order.deliveryMethod,
            paymentMethod: order.paymentMethod,
            address: order.address,
            city: order.city,
            county: order.county,
            postalCode: order.postalCode,
            easyboxName: order.easyboxName,
            easyboxAddress: order.easyboxAddress,
            easyboxCity: order.easyboxCity,
            easyboxCounty: order.easyboxCounty,
            easyboxPostalCode: order.easyboxPostalCode,
            items: order.items.map((it) => ({
                name: it.name,
                weight: it.weight,
                priceRon: it.priceRon,
                qty: it.qty,
            })),
        });
    } catch (e) {
        console.error("[email] eroare la trimiterea emailurilor pentru comanda", orderId, e);
    }
}

/** orderID trimis la NETOPIA: unic per încercare, ca plata să poată fi reîncercată după un eșec. */
function netopiaOrderIdFor(orderId: string): string {
    return `${orderId}-${Date.now().toString(36)}`;
}

/** ID-ul comenzii din orderID-ul NETOPIA (cuid-urile nu conțin "-"). */
function orderIdFromNetopia(netopiaOrderId: string): string {
    return netopiaOrderId.split("-")[0];
}

function siteOrigin(req: Request): string {
    return (process.env.SITE_URL || new URL(req.url).origin).replace(/\/$/, "");
}

function clientIp(req: Request): string | undefined {
    return (
        req.headers.get("cf-connecting-ip") ??
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    );
}

/**
 * Pornește (sau reîncearcă) plata cu cardul pentru o comandă.
 * Întoarce URL-ul paginii de plată NETOPIA sau null dacă plata nu a putut fi pornită.
 */
export async function startOrderCardPayment(orderId: string, req: Request): Promise<string | null> {
    const prisma = getPrisma();

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
    });
    if (!order || order.paymentMethod !== "CARD" || order.paymentStatus === "PAID") return null;

    const origin = siteOrigin(req);
    const netopiaOrderId = netopiaOrderIdFor(order.id);
    const isEasybox = order.deliveryMethod === "EASYBOX";

    const [firstName = "Client", ...rest] = (order.fullName ?? "").split(/\s+/).filter(Boolean);

    const address: NetopiaAddress = {
        email: order.email,
        phone: order.phone ?? "",
        firstName,
        lastName: rest.join(" ") || firstName,
        city: (isEasybox ? order.easyboxCity : order.city) || "-",
        county: (isEasybox ? order.easyboxCounty : order.county) || "",
        postalCode: (isEasybox ? order.easyboxPostalCode : order.postalCode) || "",
        details: (isEasybox ? `Easybox ${order.easyboxName} - ${order.easyboxAddress}` : order.address) || "",
    };

    const result = await startCardPayment({
        orderId: netopiaOrderId,
        description: `Comanda #${order.id.slice(-6)} - Prisaca Apuseni`,
        amountRon: order.totalRon,
        notifyUrl: `${origin}/api/netopia/ipn`,
        redirectUrl: `${origin}/comanda/${order.id}`,
        billing: address,
        shipping: address,
        products: [
            ...order.items.map((it) => ({
                name: `${it.name} ${it.weight} x${it.qty}`,
                code: it.productId,
                priceRon: it.qty * it.priceRon,
            })),
            ...(order.shippingRon > 0
                ? [{ name: "Livrare", code: "livrare", priceRon: order.shippingRon }]
                : []),
        ],
        browser: { userAgent: req.headers.get("user-agent") ?? undefined, ip: clientIp(req) },
    });

    if (!result.ok) {
        console.error(`[netopia] plata nu a putut fi pornită pentru comanda ${order.id}:`, result.error);
        await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: "FAILED" } });
        return null;
    }

    await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "PENDING", netopiaOrderId, netopiaNtpId: result.ntpId },
    });

    return result.paymentUrl;
}

function paymentStatusFromNetopia(status: number): PaymentStatus | null {
    switch (status) {
        case NETOPIA_STATUS.PAID:
        case NETOPIA_STATUS.CONFIRMED:
            return "PAID";
        case NETOPIA_STATUS.CANCELED:
            return "CANCELLED";
        case NETOPIA_STATUS.CREDIT:
            return "REFUNDED";
        case NETOPIA_STATUS.ERROR:
        case NETOPIA_STATUS.DECLINED:
        case NETOPIA_STATUS.EXPIRED:
            return "FAILED";
        default:
            // în curs (3D Secure, în așteptare, în verificare) - nu schimbăm nimic
            return null;
    }
}

/**
 * Aplică pe comandă un status primit de la NETOPIA (IPN sau interogare de status).
 * Idempotent: emailurile se trimit o singură dată, la prima confirmare a plății.
 */
export async function applyNetopiaPayment(update: NetopiaIpn): Promise<void> {
    const prisma = getPrisma();

    const next = paymentStatusFromNetopia(update.status);
    if (!next) return;

    const orderId = orderIdFromNetopia(update.orderId);
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { totalRon: true, paymentMethod: true },
    });

    if (!order || order.paymentMethod !== "CARD") {
        console.error(`[netopia] status ${update.status} pentru o comandă necunoscută: ${update.orderId}`);
        return;
    }

    if (next === "PAID") {
        if (update.amount !== null && Math.abs(update.amount - order.totalRon) > 0.01) {
            console.error(
                `[netopia] suma plătită (${update.amount}) diferă de totalul comenzii ${orderId} (${order.totalRon}) - comanda NU e marcată plătită`,
            );
            return;
        }

        const { count } = await prisma.order.updateMany({
            where: { id: orderId, paymentStatus: { not: "PAID" } },
            data: {
                paymentStatus: "PAID",
                paidAt: new Date(),
                ...(update.ntpId ? { netopiaNtpId: update.ntpId } : {}),
            },
        });

        if (count > 0) await sendOrderEmailsById(orderId);
        return;
    }

    // un eșec întârziat (ex. de la o încercare anterioară) nu suprascrie o plată reușită; o rambursare da
    await prisma.order.updateMany({
        where: next === "REFUNDED" ? { id: orderId } : { id: orderId, paymentStatus: { not: "PAID" } },
        data: { paymentStatus: next },
    });
}

/** Fallback când IPN-ul întârzie: interoghează NETOPIA pentru o plată încă în curs. */
export async function refreshCardPaymentStatus(orderId: string): Promise<void> {
    const prisma = getPrisma();

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { paymentMethod: true, paymentStatus: true, netopiaOrderId: true, netopiaNtpId: true },
    });

    if (
        order?.paymentMethod !== "CARD" ||
        order.paymentStatus !== "PENDING" ||
        !order.netopiaOrderId ||
        !order.netopiaNtpId
    ) {
        return;
    }

    try {
        const res = await getPaymentStatus(order.netopiaNtpId, order.netopiaOrderId);
        if (res) {
            await applyNetopiaPayment({
                orderId: order.netopiaOrderId,
                ntpId: order.netopiaNtpId,
                status: res.status,
                amount: res.amount,
            });
        }
    } catch (e) {
        console.error(`[netopia] interogarea statusului a eșuat pentru comanda ${orderId}:`, e);
    }
}
