"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Icon from "@/components/Icon";

export default function MobileMenu({
    links,
    isLoggedIn,
}: {
    links: { href: string; label: string }[];
    isLoggedIn: boolean;
}) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const [lastPath, setLastPath] = useState(pathname);

    // închide meniul la navigare (inclusiv înapoi/înainte în browser)
    if (pathname !== lastPath) {
        setLastPath(pathname);
        setOpen(false);
    }

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <div className="md:hidden">
            <button
                type="button"
                onClick={() => setOpen((x) => !x)}
                aria-expanded={open}
                aria-controls="meniu-mobil"
                aria-label={open ? "Închide meniul" : "Deschide meniul"}
                className="grid h-11 w-11 place-items-center rounded-lg border-[1.5px] border-rule-strong text-ink"
            >
                <Icon name={open ? "close" : "menu"} size={22} />
            </button>

            {open && (
                <div
                    id="meniu-mobil"
                    className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-rule bg-wash px-4 pb-8 pt-2"
                >
                    <nav aria-label="Meniu mobil" className="grid">
                        {links.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                onClick={() => setOpen(false)}
                                className="flex items-center justify-between border-b border-rule py-4 font-display text-2xl font-bold"
                            >
                                {l.label}
                                <Icon name="arrowRight" size={20} className="text-ink-3" />
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-6 grid gap-3">
                        {isLoggedIn ? (
                            <>
                                <Link href="/cont/comenzi" className="btn btn-ghost" onClick={() => setOpen(false)}>
                                    Comenzile mele
                                </Link>
                                <button type="button" className="btn btn-ghost" onClick={() => signOut({ callbackUrl: "/" })}>
                                    <Icon name="logout" size={18} />
                                    Ieși din cont
                                </button>
                            </>
                        ) : (
                            <Link href="/cont/login" className="btn btn-ghost" onClick={() => setOpen(false)}>
                                <Icon name="user" size={18} />
                                Intră în cont
                            </Link>
                        )}
                        <Link href="/magazin" className="btn btn-primary" onClick={() => setOpen(false)}>
                            Alege mierea
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
