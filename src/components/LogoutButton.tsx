"use client";

import { signOut } from "next-auth/react";
import Icon from "@/components/Icon";

export default function LogoutButton() {
    return (
        <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[0.95rem] font-semibold text-ink-2 hover:bg-wash-2 hover:text-ink"
        >
            <Icon name="logout" size={18} />
            Ieși
        </button>
    );
}
