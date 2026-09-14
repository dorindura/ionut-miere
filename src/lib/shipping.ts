export type DeliveryMethod = "ADDRESS" | "EASYBOX";

/** Taxe de livrare (RON), per comandă. */
export const SHIPPING_RON: Record<DeliveryMethod, number> = {
    ADDRESS: 25,
    EASYBOX: 18,
};

/** Mulți clienți cred că la easybox se poate plăti cash - lockerele acceptă doar card. */
export const EASYBOX_CARD_ONLY_NOTE =
    "La easybox plata ramburs se face doar cu cardul, direct la locker — nu se acceptă numerar.";

export function shippingRonFor(deliveryMethod: DeliveryMethod): number {
    return SHIPPING_RON[deliveryMethod] ?? SHIPPING_RON.ADDRESS;
}
