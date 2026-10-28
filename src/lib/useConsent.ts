"use client";

import { useSyncExternalStore } from "react";
import { CONSENT_EVENT, readConsent, type ConsentChoice } from "@/lib/analytics";

function subscribe(onChange: () => void) {
    window.addEventListener(CONSENT_EVENT, onChange);
    // alegerea făcută în alt tab
    window.addEventListener("storage", onChange);
    return () => {
        window.removeEventListener(CONSENT_EVENT, onChange);
        window.removeEventListener("storage", onChange);
    };
}

/** Alegerea vizitatorului: `null` cât timp nu a răspuns bannerului. */
export function useConsent(): ConsentChoice | null {
    return useSyncExternalStore(subscribe, readConsent, () => null);
}
