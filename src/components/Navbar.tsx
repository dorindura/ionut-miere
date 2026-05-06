import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getPrisma } from "@/lib/db";
import LogoutButton from "@/components/LogoutButton";

type Props = {
    brandName: string;
    ctaHref?: string;
    ctaLabel?: string;
};

export default async function Navbar({
                                         brandName,
                                         ctaHref = "/magazin",
                                         ctaLabel = "Comandă acum",
                                     }: Props) {
    const session = await getServerSession(authOptions);
    const prisma = getPrisma();

    const email = session?.user?.email ?? null;
    const isLoggedIn = !!email;
    const isAdmin =
        (session as any)?.role === "ADMIN" || (session?.user as any)?.role === "ADMIN";

    let cartCount = 0;
    if (email) {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { cart: { include: { items: true } } },
        });
        cartCount = user?.cart?.items?.reduce((sum, it) => sum + it.qty, 0) ?? 0;
    }

    return (
        <header className="sticky top-0 z-50 border-b border-yellow-500/15 bg-neutral-950/70 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                <Link href="/" className="group inline-flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-yellow-500 text-neutral-950 font-black">
            🍯
          </span>
                    <span className="text-sm font-semibold tracking-wide">
            {brandName}
                        <span className="block text-[11px] text-neutral-300/80">miere naturală • România</span>
          </span>
                </Link>

                <nav className="hidden items-center gap-6 md:flex">
                    <Link href="/magazin" className="text-sm text-neutral-200 hover:text-yellow-300">Magazin</Link>
                    <Link href="/#contact" className="text-sm text-neutral-200 hover:text-yellow-300">Contact</Link>

                    {isAdmin && (
                        <Link href="/admin" className="text-sm text-yellow-200 hover:text-yellow-300">
                            Admin
                        </Link>
                    )}
                </nav>

                <div className="flex items-center gap-2">
                    {isLoggedIn && (
                        <Link
                            href="/cos"
                            className="hidden sm:inline-flex items-center rounded-xl border border-yellow-500/25 px-3 py-2 text-sm hover:border-yellow-400/60"
                        >
                            Coș
                            {cartCount > 0 && (
                                <span className="ml-2 rounded-full bg-yellow-500 px-2 py-0.5 text-xs font-black text-neutral-950">
                  {cartCount}
                </span>
                            )}
                        </Link>
                    )}

                    {!isLoggedIn ? (
                        <Link
                            href="/cont/login"
                            className="hidden sm:inline-flex rounded-xl border border-yellow-500/25 px-3 py-2 text-sm hover:border-yellow-400/60"
                        >
                            Login
                        </Link>
                    ) : (
                        <LogoutButton />
                    )}

                    <Link
                        href={ctaHref}
                        className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-yellow-400 transition-colors"
                    >
                        {ctaLabel}
                    </Link>
                </div>
            </div>
        </header>
    );
}