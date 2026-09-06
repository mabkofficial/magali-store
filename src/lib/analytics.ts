type GtagCommand = (
  command: "event",
  eventName: string,
  params?: Record<string, string | number | boolean>,
) => void;

declare global {
  interface Window {
    gtag?: GtagCommand;
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, params);
}

export function trackFbtImpression(
  anchorId: string,
  companionIds: string[],
  surface: "pdp" | "cart" | "mini_cart",
) {
  trackEvent("fbt_impression", {
    anchor_id: anchorId,
    companion_ids: companionIds.join(","),
    surface,
    companion_count: companionIds.length,
  });
}

export function trackFbtCompanionToggle(
  productId: string,
  checked: boolean,
  surface: "pdp" | "cart" | "mini_cart",
) {
  trackEvent("fbt_companion_toggle", {
    product_id: productId,
    checked,
    surface,
  });
}

export function trackFbtAddToCart(
  productIds: string[],
  totalValue: number,
  surface: "pdp" | "cart" | "mini_cart",
) {
  trackEvent("fbt_add_to_cart", {
    product_ids: productIds.join(","),
    item_count: productIds.length,
    value: totalValue,
    surface,
  });
}
