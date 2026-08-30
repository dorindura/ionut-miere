export type DeliveryMethod = "ADDRESS" | "EASYBOX";

/** Taxe de livrare (RON), per comandă. */
export const SHIPPING_RON: Record<DeliveryMethod, number> = {
    ADDRESS: 25,
    EASYBOX: 18,
};

export function shippingRonFor(deliveryMethod: DeliveryMethod): number {
    return SHIPPING_RON[deliveryMethod] ?? SHIPPING_RON.ADDRESS;
}
