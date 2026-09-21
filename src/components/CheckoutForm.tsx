"use client";

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

            <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-start">
                <form
                    action="/api/checkout"
                    method="POST"
                    className="sheet grid gap-4 p-5 md:p-6 lg:col-span-7"
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
                        <p className="rounded-lg bg-hive-red/10 px-4 py-3 text-[0.95rem] text-hive-red">
                            {errorMessage}
                        </p>
                    ) : null}

                    <p className="text-lg font-bold">
                        Date facturare
                    </p>

                    <label className="label">
                        Nume complet *
                        <input
                            name="fullName"
                            required
                            autoComplete="name"
                            className="field"
                        />
                    </label>

                    <label className="label">
                        Email *
                        <input
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            defaultValue={defaultEmail}
                            placeholder="exemplu@email.com"
                            className="field"
                        />
                    </label>

                    <label className="label">
                        Telefon *
                        <input
                            name="phone"
                            type="tel"
                            required
                            autoComplete="tel"
                            placeholder="07xx xxx xxx"
                            className="field"
                        />
                    </label>

                    <div className="grid gap-2">
                        <p className="font-bold">Metodă livrare</p>

                        <label className="flex min-h-12 items-center cursor-pointer gap-3 rounded-lg border-[1.5px] border-rule-strong bg-paper px-3 py-3 font-semibold transition-colors hover:border-ink-3 has-[:checked]:border-ink has-[:checked]:shadow-[inset_0_0_0_1px_var(--color-ink)]">
                            <input
                                className="h-5 w-5 shrink-0"
                                type="radio"
                                checked={deliveryMethod === "ADDRESS"}
                                onChange={() => {
                                    setDeliveryMethod("ADDRESS");
                                    setEasybox(null);
                                }}
                            />
                            Livrare la adresă (+{SHIPPING_RON.ADDRESS} lei)
                        </label>

                        <label className="flex min-h-12 items-center cursor-pointer gap-3 rounded-lg border-[1.5px] border-rule-strong bg-paper px-3 py-3 font-semibold transition-colors hover:border-ink-3 has-[:checked]:border-ink has-[:checked]:shadow-[inset_0_0_0_1px_var(--color-ink)]">
                            <input
                                className="h-5 w-5 shrink-0"
                                type="radio"
                                checked={deliveryMethod === "EASYBOX"}
                                onChange={() => setDeliveryMethod("EASYBOX")}
                            />
                            Livrare la easybox (+{SHIPPING_RON.EASYBOX} lei)
                        </label>
                    </div>

                    {deliveryMethod === "ADDRESS" ? (
                        <div className="grid gap-3">
                            <label className="label">
                                Adresă livrare *
                                <textarea
                                    name="address"
                                    required
                                    autoComplete="street-address"
                                    placeholder="Stradă, număr, bloc, scară, apartament"
                                    className="field !min-h-24"
                                />
                            </label>

                            {/* min-w-0: altfel lățimea implicită a inputului depășește coloana și câmpurile se suprapun */}
                            <div className="grid gap-3 sm:grid-cols-3">
                                <label className="label min-w-0">
                                    Localitate *
                                    <input
                                        name="city"
                                        required
                                        autoComplete="address-level2"
                                        className="field"
                                    />
                                </label>

                                <label className="label min-w-0">
                                    Județ *
                                    <input
                                        name="county"
                                        required
                                        autoComplete="address-level1"
                                        className="field"
                                    />
                                </label>

                                <label className="label min-w-0">
                                    Cod poștal
                                    <input
                                        name="postalCode"
                                        inputMode="numeric"
                                        autoComplete="postal-code"
                                        className="field"
                                    />
                                </label>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg bg-wash p-4">
                            <button
                                type="button"
                                onClick={openEasyboxPicker}
                                className="btn btn-primary"
                            >
                                Alege easybox
                            </button>

                            {easybox ? (
                                <div className="mt-4 text-[0.95rem] text-ink">
                                    <p className="font-semibold text-ink">{easybox.name}</p>
                                    <p className="mt-1 text-ink-2">{easybox.address}</p>
                                    <p className="text-ink-3">
                                        {[easybox.city, easybox.county, easybox.postalCode]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </p>
                                </div>
                            ) : (
                                <p className="mt-3 text-[0.85rem] text-ink-3">
                                    Selectează un easybox pentru livrare.
                                </p>
                            )}
                        </div>
                    )}

                    <div className="grid gap-2">
                        <p className="font-bold">Metodă de plată</p>

                        {cardEnabled ? (
                            <label className="flex items-start cursor-pointer gap-3 rounded-lg border-[1.5px] border-rule-strong bg-paper px-3 py-3 font-semibold transition-colors hover:border-ink-3 has-[:checked]:border-ink has-[:checked]:shadow-[inset_0_0_0_1px_var(--color-ink)]">
                                <input
                                    type="radio"
                                    className="mt-0.5 h-5 w-5 shrink-0"
                                    checked={paymentMethod === "CARD"}
                                    onChange={() => setPaymentMethod("CARD")}
                                />
                                <span>
                                    Card online (Visa / Mastercard)
                                    <span className="block text-[0.85rem] text-ink-3">
                                        Plată securizată prin NETOPIA Payments. Nu mai plătești nimic la livrare.
                                    </span>
                                </span>
                            </label>
                        ) : null}

                        <label className="flex items-start cursor-pointer gap-3 rounded-lg border-[1.5px] border-rule-strong bg-paper px-3 py-3 font-semibold transition-colors hover:border-ink-3 has-[:checked]:border-ink has-[:checked]:shadow-[inset_0_0_0_1px_var(--color-ink)]">
                            <input
                                type="radio"
                                className="mt-0.5 h-5 w-5 shrink-0"
                                checked={!isCard}
                                onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
                            />
                            <span>
                                Ramburs la livrare
                                <span className="block text-[0.85rem] text-ink-3">
                                    {deliveryMethod === "EASYBOX"
                                        ? "Plătești cu cardul la easybox, când ridici coletul."
                                        : "Plătești la curier, la livrare."}
                                </span>
                            </span>
                        </label>

                        {deliveryMethod === "EASYBOX" && !isCard ? (
                            <p className="mt-1 rounded-lg bg-hive-sun/35 px-3 py-2 text-[0.85rem] font-semibold text-ink">
                                {EASYBOX_CARD_ONLY_NOTE}
                            </p>
                        ) : null}
                    </div>

                    <button
                        type="submit"
                        disabled={deliveryMethod === "EASYBOX" && !easybox}
                        className="btn btn-primary mt-2 w-full text-base"
                    >
                        {isCard ? "Continuă spre plata cu cardul" : "Plasează comanda"}
                    </button>

                    <p className="text-[0.85rem] text-ink-3">
                        {isCard
                            ? "Vei fi redirecționat către pagina securizată NETOPIA Payments. Datele cardului nu ajung la noi."
                            : "*Ramburs. După confirmare, comanda va fi pregătită pentru livrare."}
                    </p>
                </form>

                <aside className="sheet p-5 md:p-6 lg:sticky lg:top-24 lg:col-span-5">
                    <h2 className="text-xl font-extrabold">Sumar</h2>

                    <div className="mt-4 grid gap-3">
                        {items.map((it) => (
                            <div key={it.id} className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="font-semibold">{it.product.name}</p>
                                    <p className="text-[0.95rem] text-ink-2">
                                        {it.product.weight} • {it.qty} x {it.product.priceRon} lei
                                    </p>
                                </div>

                                <p className="font-semibold text-ink">
                                    {it.qty * it.product.priceRon} lei
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 grid gap-2 border-t border-rule pt-4">
                        <div className="flex items-center justify-between text-[0.95rem] text-ink-2">
                            <p>Subtotal produse</p>
                            <p className="font-semibold text-ink">{subtotalRon} lei</p>
                        </div>

                        <div className="flex items-center justify-between text-[0.95rem] text-ink-2">
                            <p>
                                Livrare{" "}
                                <span className="text-ink-3">
                                    ({deliveryMethod === "EASYBOX" ? "easybox" : "la adresă"})
                                </span>
                            </p>
                            <p className="font-semibold text-ink">{shippingRon} lei</p>
                        </div>

                        <div className="flex items-center justify-between text-[0.95rem] text-ink-2">
                            <p>Plată</p>
                            <p className="font-semibold text-ink">{isCard ? "card online" : "ramburs"}</p>
                        </div>

                        <div className="mt-2 flex items-center justify-between border-t border-rule pt-3">
                            <p className="text-[0.95rem] text-ink-2">Total</p>
                            <p className="text-2xl font-extrabold text-ink">{totalRon} lei</p>
                        </div>
                    </div>
                </aside>
            </div>
        </>
    );
}
