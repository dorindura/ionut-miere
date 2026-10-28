"use client";

import { useEffect } from "react";
import { trackViewItem, type TrackItem } from "@/lib/analytics";

/** Trimite `view_item` / `ViewContent` când se deschide pagina unui borcan. */
export default function TrackViewItem({ item }: { item: TrackItem }) {
    useEffect(() => {
        trackViewItem(item);
        // urmărim borcanul, nu identitatea obiectului primit de la server
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item.slug]);

    return null;
}
