import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPrisma } from "@/lib/db";
import type { Cart } from "@prisma/client";

const CART_COOKIE = "cartSessionId";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 60; // 60 zile

/**
 * Rezolvă coșul activ pentru cererea curentă.
 *
 * - Dacă userul e logat → coșul legat de contul lui.
 * - Altfel → coș anonim (guest) identificat printr-un cookie httpOnly.
 *
 * @param ensure  dacă `true`, creează coșul (și cookie-ul) dacă lipsește.
 *                Apelează cu `true` DOAR din Route Handler / Server Action,
 *                unde scrierea cookie-urilor este permisă.
 */
export async function getOrCreateCart(ensure = false): Promise<Cart | null> {
    const prisma = getPrisma();
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (email) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            if (ensure) {
                return prisma.cart.upsert({
                    where: { userId: user.id },
                    create: { userId: user.id },
                    update: {},
                });
            }
            return prisma.cart.findUnique({ where: { userId: user.id } });
        }
    }

    const cookieStore = await cookies();
    let sid = cookieStore.get(CART_COOKIE)?.value;

    if (!sid) {
        if (!ensure) return null;
        sid = crypto.randomUUID();
        cookieStore.set(CART_COOKIE, sid, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: CART_COOKIE_MAX_AGE,
            secure: process.env.NODE_ENV === "production",
        });
    }

    if (ensure) {
        return prisma.cart.upsert({
            where: { sessionId: sid },
            create: { sessionId: sid },
            update: {},
        });
    }

    return prisma.cart.findUnique({ where: { sessionId: sid } });
}
