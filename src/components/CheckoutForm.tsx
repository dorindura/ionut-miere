"use client";

import Script from "next/script";
import { useState } from "react";

type CartItemView = {
    id: string;
    product: {
        name: string;
        weight: string;
        priceRon: number;
    };
    qty: number;
};

type Easybox = {
    lockerId: number | string;
    name: string;
    address: string;
    city?: string;
    county?: string;
    postalCode?: string;
};

declare global {
    interface Window {
        LockerPlugin?: any;
    }
}

export default function CheckoutForm({
                                         items,
                                         totalRon,
                                     }: {
    items: CartItemView[];
    totalRon: number;
}) {
    const [deliveryMethod, setDeliveryMethod] = useState<"ADDRESS" | "EASYBOX">("ADDRESS");
    const [easybox, setEasybox] = useState<Easybox | null>(null);

    const openEasyboxPicker = () => {
        if (!window.LockerPlugin) {
            alert("Harta easybox încă se încarcă. Încearcă din nou în câteva secunde.");
            return;
        }

        const plugin = window.LockerPlugin.init({
            clientId: process.env.NEXT_PUBLIC_SAMEDAY_CLIENT_ID,
            countryCode: "RO",
            langCode: "ro",
        });

        plugin.open((locker: Easybox) => {
            setEasybox(locker);
            setDeliveryMethod("EASYBOX");
        });
    };

    return (
        <>
            <Script
                src="https://cdn.sameday.ro/locker-plugin/lockerpluginsdk.js"
                strategy="afterInteractive"
            />

            <div className="mt-8 grid gap-6 md:grid-cols-2">
                <form
                    action="/api/checkout"
                    method="POST"
                    className="rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6 grid gap-3"
                >
                    <input type="hidden" name="deliveryMethod" value={deliveryMethod} />

                    <input type="hidden" name="easyboxId" value={easybox?.lockerId ?? ""} />
                    <input type="hidden" name="easyboxName" value={easybox?.name ?? ""} />
                    <input type="hidden" name="easyboxAddress" value={easybox?.address ?? ""} />
                    <input type="hidden" name="easyboxCity" value={easybox?.city ?? ""} />
                    <input type="hidden" name="easyboxCounty" value={easybox?.county ?? ""} />
                    <input type="hidden" name="easyboxPostalCode" value={easybox?.postalCode ?? ""} />

                    <label className="grid gap-1 text-sm">
                        <span className="text-neutral-200">Nume complet</span>
                        <input
                            name="fullName"
                            required
                            className="rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span className="text-neutral-200">Telefon</span>
                        <input
                            name="phone"
                            required
                            className="rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                        />
                    </label>

                    <div className="grid gap-2 rounded-2xl border border-yellow-500/10 bg-neutral-950/40 p-4">
                        <p className="text-sm font-semibold text-neutral-100">Metodă livrare</p>

                        <label className="flex items-center gap-2 text-sm text-neutral-200">
                            <input
                                type="radio"
                                checked={deliveryMethod === "ADDRESS"}
                                onChange={() => {
                                    setDeliveryMethod("ADDRESS");
                                    setEasybox(null);
                                }}
                            />
                            Livrare la adresă
                        </label>

                        <label className="flex items-center gap-2 text-sm text-neutral-200">
                            <input
                                type="radio"
                                checked={deliveryMethod === "EASYBOX"}
                                onChange={() => setDeliveryMethod("EASYBOX")}
                            />
                            Livrare la easybox
                        </label>
                    </div>

                    {deliveryMethod === "ADDRESS" ? (
                        <label className="grid gap-1 text-sm">
                            <span className="text-neutral-200">Adresă livrare</span>
                            <textarea
                                name="address"
                                required
                                className="min-h-[120px] rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                            />
                        </label>
                    ) : (
                        <div className="rounded-2xl border border-yellow-500/15 bg-neutral-950/50 p-4">
                            <button
                                type="button"
                                onClick={openEasyboxPicker}
                                className="rounded-xl bg-yellow-500 px-4 py-3 text-sm font-semibold text-neutral-950 hover:bg-yellow-400"
                            >
                                Alege easybox
                            </button>

                            {easybox ? (
                                <div className="mt-4 text-sm text-neutral-200">
                                    <p className="font-semibold text-yellow-300">{easybox.name}</p>
                                    <p className="mt-1 text-neutral-300">{easybox.address}</p>
                                    <p className="text-neutral-400">
                                        {[easybox.city, easybox.county, easybox.postalCode]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </p>
                                </div>
                            ) : (
                                <p className="mt-3 text-xs text-neutral-400">
                                    Selectează un easybox pentru livrare.
                                </p>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={deliveryMethod === "EASYBOX" && !easybox}
                        className="mt-2 rounded-xl bg-yellow-500 px-6 py-3 text-sm font-semibold text-neutral-950 hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Plasează comanda
                    </button>

                    <p className="text-xs text-neutral-400">
                        *Ramburs. După confirmare, comanda va fi pregătită pentru livrare.
                    </p>
                </form>

                <aside className="rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6">
                    <h2 className="text-xl font-black">Sumar</h2>

                    <div className="mt-4 grid gap-3">
                        {items.map((it) => (
                            <div key={it.id} className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="font-semibold">{it.product.name}</p>
                                    <p className="text-sm text-neutral-300">
                                        {it.product.weight} • {it.qty} x {it.product.priceRon} RON
                                    </p>
                                </div>

                                <p className="font-semibold text-yellow-300">
                                    {it.qty * it.product.priceRon} RON
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 border-t border-yellow-500/10 pt-4 flex items-center justify-between">
                        <p className="text-sm text-neutral-300">Total</p>
                        <p className="text-2xl font-black text-yellow-300">{totalRon} RON</p>
                    </div>
                </aside>
            </div>
        </>
    );
}