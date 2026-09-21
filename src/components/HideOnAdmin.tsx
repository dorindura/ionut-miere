"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** în /admin, meniul și subsolul magazinului dispar: administrarea are propriul meniu */
export default function HideOnAdmin({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
    return <>{children}</>;
}
