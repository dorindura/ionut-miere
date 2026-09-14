"use client";

import Link from "next/link";
import Script from "next/script";
import { useRef, useState } from "react";
import { EASYBOX_CARD_ONLY_NOTE, SHIPPING_RON } from "@/lib/shipping";

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
        LockerPlugin?: {
            init: (options: {
                clientId: string;
                apiUsername: string;
                countryCode: string;
                langCode: string;
            }) => void;
            getInstance: () => {
                subscribe: (callback: (locker: Easybox) => void) => void;
                open: () => void;
            } | undefined;
        };
    }
}

export default function CheckoutForm({
                                         items,
                                         subtotalRon,
                                         defaultEmail = "",
                                         errorMessage = "",
                                         cardEnabled = false,
                                     }: {
    items: CartItemView[];
    subtotalRon: number;
    defaultEmail?: string;
    errorMessage?: string;
    cardEnabled?: boolean;
}) {
    const [deliveryMethod, setDeliveryMethod] = useState<"ADDRESS" | "EASYBOX">("ADDRESS");
    const [paymentMethod, setPaymentMethod] = useState<"CARD" | "CASH_ON_DELIVERY">(
        cardEnabled ? "CARD" : "CASH_ON_DELIVERY",
    );
    const [easybox, setEasybox] = useState<Easybox | null>(null);
    const isLockerPluginSubscribed = useRef(false);

    const isCard = cardEnabled && paymentMethod === "CARD";
    const shippingRon = SHIPPING_RON[deliveryMethod];
    const totalRon = subtotalRon + shippingRon;

    const openEasyboxPicker = () => {
        if (!window.LockerPlugin) {
            alert("Harta easybox încă se încarcă. Încearcă din nou în câteva secunde.");
            return;
        }

        const clientId = process.env.NEXT_PUBLIC_SAMEDAY_CLIENT_ID;
        const apiUsername = process.env.NEXT_PUBLIC_SAMEDAY_API_USERNAME;

        if (!clientId || !apiUsername) {
            alert("Configurarea easybox este incompletă. Verifică variabilele NEXT_PUBLIC_SAMEDAY_CLIENT_ID și NEXT_PUBLIC_SAMEDAY_API_USERNAME.");
            return;
        }

        window.LockerPlugin.init({
            clientId,
            apiUsername,
            countryCode: "RO",
            langCode: "ro",
        });

        const plugin = window.LockerPlugin.getInstance();

        if (!plugin) {
            alert("Harta easybox nu a putut fi inițializată. Încearcă din nou în câteva secunde.");
            return;
        }

        if (!isLockerPluginSubscribed.current) {
            plugin.subscribe((locker: Easybox) => {
                setEasybox(locker);
                setDeliveryMethod("EASYBOX");
            });
            isLockerPluginSubscribed.current = true;
        }

        plugin.open();
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
                    <input type="hidden" name="paymentMethod" value={isCard ? "CARD" : "CASH_ON_DELIVERY"} />

                    <input type="hidden" name="easyboxId" value={easybox?.lockerId ?? ""} />
                    <input type="hidden" name="easyboxName" value={easybox?.name ?? ""} />
                    <input type="hidden" name="easyboxAddress" value={easybox?.address ?? ""} />
                    <input type="hidden" name="easyboxCity" value={easybox?.city ?? ""} />
                    <input type="hidden" name="easyboxCounty" value={easybox?.county ?? ""} />
                    <input type="hidden" name="easyboxPostalCode" value={easybox?.postalCode ?? ""} />

                    {errorMessage ? (
                        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                            {errorMessage}
                        </p>
                    ) : null}

                    <p className="text-xs font-semibold uppercase tracking-wide text-yellow-300/80">
                        Date facturare
                    </p>

                    <label className="grid gap-1 text-sm">
                        <span className="text-neutral-200">Nume complet *</span>
                        <input
                            name="fullName"
                            required
                            autoComplete="name"
                            className="rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span className="text-neutral-200">Email *</span>
                        <input
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            defaultValue={defaultEmail}
                            placeholder="exemplu@email.com"
                            className="rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span className="text-neutral-200">Telefon *</span>
                        <input
                            name="phone"
                            type="tel"
                            required
                            autoComplete="tel"
                            placeholder="07xx xxx xxx"
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
                            Livrare la adresă (+{SHIPPING_RON.ADDRESS} RON)
                        </label>

                        <label className="flex items-center gap-2 text-sm text-neutral-200">
                            <input
                                type="radio"
                                checked={deliveryMethod === "EASYBOX"}
                                onChange={() => setDeliveryMethod("EASYBOX")}
                            />
                            Livrare la easybox (+{SHIPPING_RON.EASYBOX} RON)
                        </label>
                    </div>

                    {deliveryMethod === "ADDRESS" ? (
                        <div className="grid gap-3">
                            <label className="grid gap-1 text-sm">
                                <span className="text-neutral-200">Adresă livrare *</span>
                                <textarea
                                    name="address"
                                    required
                                    autoComplete="street-address"
                                    placeholder="Stradă, număr, bloc, scară, apartament"
                                    className="min-h-[96px] rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                                />
                            </label>

                            {/* min-w-0: altfel lățimea implicită a inputului depășește coloana și câmpurile se suprapun */}
                            <div className="grid gap-3 sm:grid-cols-3">
                                <label className="grid min-w-0 gap-1 text-sm">
                                    <span className="text-neutral-200">Localitate *</span>
                                    <input
                                        name="city"
                                        required
                                        autoComplete="address-level2"
                                        className="w-full min-w-0 rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                                    />
                                </label>

                                <label className="grid min-w-0 gap-1 text-sm">
                                    <span className="text-neutral-200">Județ *</span>
                                    <input
                                        name="county"
                                        required
                                        autoComplete="address-level1"
                                        className="w-full min-w-0 rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                                    />
                                </label>

                                <label className="grid min-w-0 gap-1 text-sm">
                                    <span className="text-neutral-200">Cod poștal</span>
                                    <input
                                        name="postalCode"
                                        inputMode="numeric"
                                        autoComplete="postal-code"
                                        className="w-full min-w-0 rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"
                                    />
                                </label>
                            </div>
                        </div>
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

                    <div className="grid gap-2 rounded-2xl border border-yellow-500/10 bg-neutral-950/40 p-4">
                        <p className="text-sm font-semibold text-neutral-100">Metodă de plată</p>

                        {cardEnabled ? (
                            <label className="flex items-start gap-2 text-sm text-neutral-200">
                                <input
                                    type="radio"
                                    className="mt-1"
                                    checked={paymentMethod === "CARD"}
                                    onChange={() => setPaymentMethod("CARD")}
                                />
                                <span>
                                    Card online (Visa / Mastercard)
                                    <span className="block text-xs text-neutral-400">
                                        Plată securizată prin NETOPIA Payments. Nu mai plătești nimic la livrare.
                                    </span>
                                </span>
                            </label>
                        ) : null}

                        <label className="flex items-start gap-2 text-sm text-neutral-200">
                            <input
                                type="radio"
                                className="mt-1"
                                checked={!isCard}
                                onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
                            />
                            <span>
                                Ramburs la livrare
                                <span className="block text-xs text-neutral-400">
                                    {deliveryMethod === "EASYBOX"
                                        ? "Plătești cu cardul la easybox, când ridici coletul."
                                        : "Plătești la curier, la livrare."}
                                </span>
                            </span>
                        </label>

                        {deliveryMethod === "EASYBOX" && !isCard ? (
                            <p className="mt-1 rounded-xl border border-yellow-400/40 bg-yellow-500/10 px-3 py-2 text-xs font-semibold text-yellow-200">
                                ⚠️ {EASYBOX_CARD_ONLY_NOTE}
                            </p>
                        ) : null}
                    </div>

                    <button
                        type="submit"
                        disabled={deliveryMethod === "EASYBOX" && !easybox}
                        className="mt-2 rounded-xl bg-yellow-500 px-6 py-3 text-sm font-semibold text-neutral-950 hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isCard ? "Continuă spre plata cu cardul" : "Plasează comanda"}
                    </button>

                    <p className="text-xs text-neutral-400">
                        Prin plasarea comenzii confirmi că ai citit{" "}
                        <Link href="/termeni" target="_blank" className="text-yellow-300 underline">Termenii și condițiile</Link>
                        {" "}și{" "}
                        <Link href="/confidentialitate" target="_blank" className="text-yellow-300 underline">Politica de confidențialitate</Link>.
                    </p>

                    <p className="text-xs text-neutral-400">
                        {isCard
                            ? "Vei fi redirecționat către pagina securizată NETOPIA Payments. Datele cardului nu ajung la noi."
                            : "*Ramburs. După confirmare, comanda va fi pregătită pentru livrare."}
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

                    <div className="mt-6 grid gap-2 border-t border-yellow-500/10 pt-4">
                        <div className="flex items-center justify-between text-sm text-neutral-300">
                            <p>Subtotal produse</p>
                            <p className="font-semibold text-neutral-100">{subtotalRon} RON</p>
                        </div>

                        <div className="flex items-center justify-between text-sm text-neutral-300">
                            <p>
                                Livrare{" "}
                                <span className="text-neutral-400">
                                    ({deliveryMethod === "EASYBOX" ? "easybox" : "la adresă"})
                                </span>
                            </p>
                            <p className="font-semibold text-neutral-100">{shippingRon} RON</p>
                        </div>

                        <div className="flex items-center justify-between text-sm text-neutral-300">
                            <p>Plată</p>
                            <p className="font-semibold text-neutral-100">{isCard ? "card online" : "ramburs"}</p>
                        </div>

                        <div className="mt-2 flex items-center justify-between border-t border-yellow-500/10 pt-3">
                            <p className="text-sm text-neutral-300">Total</p>
                            <p className="text-2xl font-black text-yellow-300">{totalRon} RON</p>
                        </div>
                    </div>
                </aside>
            </div>
        </>
    );
}
