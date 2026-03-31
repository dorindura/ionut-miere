"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-xl border border-yellow-500/25 px-3 py-2 text-sm hover:border-yellow-400/60"
        >
            Logout
        </button>
    );
}