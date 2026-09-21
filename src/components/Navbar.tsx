import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getPrisma } from "@/lib/db";
import { getOrCreateCart } from "@/lib/cart";
import LogoutButton from "@/components/LogoutButton";
import MobileMenu from "@/components/MobileMenu";
import Icon, { HiveMark } from "@/components/Icon";

type Props = {
    brandName: string;
};

const LINKS = [
    { href: "/magazin", label: "Magazin" },
    { href: "/#stupina", label: "Stupina" },
    { href: "/#livrare", label: "Livrare" },
    { href: "/#contact", label: "Contact" },
];

export default async function Navbar({ brandName }: Props) {
    const session = await getServerSession(authOptions);
    const prisma = getPrisma();

    const email = session?.user?.email ?? null;
    const isLoggedIn = !!email;
    const isAdmin =
        (session as any)?.role === "ADMIN" || (session?.user as any)?.role === "ADMIN";

    const cart = await getOrCreateCart(false);
    const cartItems = cart
        ? await prisma.cartItem.findMany({ where: { cartId: cart.id }, select: { qty: true } })
        : [];
    const cartCount = cartItems.reduce((sum, it) => sum + it.qty, 0);

    const links = isAdmin ? [...LINKS, { href: "/admin", label: "Admin" }] : LINKS;

    return (
        <header className="sticky top-0 z-50 border-b border-rule bg-wash">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:h-[4.5rem]">
                <Link href="/" className="inline-flex items-center gap-2.5" aria-label={`${brandName} — acasă`}>
                    <HiveMark size={32} />
                    <span className="leading-none">
                        <span className="block whitespace-nowrap font-display text-[1.05rem] font-extrabold tracking-[-0.02em] sm:text-[1.15rem]">
                            {brandName}
                        </span>
                        <span className="mt-1 hidden text-[0.78rem] text-ink-3 sm:block">Gârde · Munții Apuseni</span>
                    </span>
                </Link>

                <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className="rounded-lg px-3 py-2 text-[0.95rem] font-semibold text-ink-2 transition-colors hover:bg-wash-2 hover:text-ink"
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-1.5">
                    <div className="hidden items-center gap-1.5 md:flex">
                        {isLoggedIn ? (
                            <>
                                <Link
                                    href="/cont/comenzi"
                                    className="rounded-lg px-3 py-2 text-[0.95rem] font-semibold text-ink-2 hover:bg-wash-2 hover:text-ink"
                                >
                                    Comenzile mele
                                </Link>
                                <LogoutButton />
                            </>
                        ) : (
                            <Link
                                href="/cont/login"
                                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[0.95rem] font-semibold text-ink-2 hover:bg-wash-2 hover:text-ink"
                            >
                                <Icon name="user" size={18} />
                                Contul meu
                            </Link>
                        )}
                    </div>

                    <Link
                        href="/cos"
                        className="relative inline-flex h-11 items-center gap-2 rounded-lg bg-ink pl-3 pr-3.5 font-bold text-wash transition-colors hover:bg-forest"
                        aria-label={cartCount > 0 ? `Coș, ${cartCount} produse` : "Coș, gol"}
                    >
                        <Icon name="cart" size={19} />
                        <span className="hidden text-[0.95rem] min-[400px]:inline">Coș</span>
                        {cartCount > 0 && (
                            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-hive-sun px-1.5 text-[0.8rem] font-extrabold tabular-nums text-ink">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <MobileMenu links={links} isLoggedIn={isLoggedIn} />
                </div>
            </div>
        </header>
    );
}
