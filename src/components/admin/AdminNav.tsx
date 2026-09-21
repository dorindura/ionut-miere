"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Icon, { HiveMark, type IconName } from "@/components/Icon";

const ITEMS: { href: string; label: string; icon: IconName; exact?: boolean }[] = [
    { href: "/admin", label: "Panou", icon: "home", exact: true },
    { href: "/admin/comenzi", label: "Comenzi", icon: "list" },
    { href: "/admin/produse", label: "Produse", icon: "jar" },
];

export default function AdminNav() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 border-b border-rule bg-paper">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4">
                <Link href="/admin" className="mr-2 hidden shrink-0 items-center gap-2 sm:inline-flex" aria-label="Panou de administrare">
                    <HiveMark size={28} />
                    <span className="font-display text-[1.05rem] font-extrabold">Admin</span>
                </Link>
                <nav aria-label="Administrare" className="no-scrollbar -mb-px flex flex-1 overflow-x-auto">
                    {ITEMS.map((it) => {
                        const active = it.exact ? pathname === it.href : pathname.startsWith(it.href);
                        return (
                            <Link
                                key={it.href}
                                href={it.href}
                                aria-current={active ? "page" : undefined}
                                className={`inline-flex items-center gap-2 border-b-[3px] px-2 py-3.5 sm:px-3 text-[0.95rem] font-bold transition-colors ${
                                    active
                                        ? "border-hive-blue text-ink"
                                        : "border-transparent text-ink-3 hover:text-ink"
                                }`}
                            >
                                <Icon name={it.icon} size={18} className="hidden min-[400px]:block" />
                                {it.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="flex shrink-0 items-center gap-1">
                    <Link
                        href="/"
                        target="_blank"
                        aria-label="Vezi magazinul"
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[0.9rem] font-semibold text-ink-3 hover:text-ink"
                    >
                        <span className="hidden md:inline">Vezi magazinul</span>
                        <Icon name="external" size={17} />
                    </Link>
                    <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: "/" })}
                        aria-label="Ieși din cont"
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[0.9rem] font-semibold text-ink-3 hover:bg-wash hover:text-ink"
                    >
                        <Icon name="logout" size={17} />
                        <span className="hidden sm:inline">Ieși</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
