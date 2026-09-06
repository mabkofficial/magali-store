import type { Product } from "@/types/product";

export const FBT_BUNDLE_DISCOUNT_PERCENT = 10;

export const FBT_DISCOUNT_ELIGIBLE_IDS = new Set([
  "hair-oil",
  "hair-grease",
  "pureheal-oil",
]);

type FbtSectionMeta = {
  title: string;
  description: string;
  legend: string;
  helperText: string;
};

const SECTION_META: Record<string, FbtSectionMeta> = {
  "hair-oil": {
    title: "Complete Your Hair Routine",
    description:
      "Nourish with Botanical Hair Oil, then seal moisture with Herbal Hair Grease.",
    legend: "Complete your hair routine — select items to add",
    helperText:
      "Recommended routine selected — uncheck any you don't need.",
  },
  "hair-grease": {
    title: "Complete Your Hair Routine",
    description:
      "Style and seal with Hair Grease, then nourish your scalp with Botanical Hair Oil.",
    legend: "Complete your hair routine — select items to add",
    helperText:
      "Recommended routine selected — uncheck any you don't need.",
  },
  "pureheal-oil": {
    title: "Complete Your Wellness & Hair Care",
    description:
      "Pair targeted PureHeal comfort with everyday hair nourishment.",
    legend: "Complete your wellness and hair care — select items to add",
    helperText:
      "Recommended pairing selected — uncheck any you don't need.",
  },
};

const ROUTINE_STEPS: Record<
  string,
  Record<string, string>
> = {
  "hair-oil": {
    "hair-oil": "Treat",
    "hair-grease": "Seal",
    "pureheal-oil": "Wellness",
  },
  "hair-grease": {
    "hair-grease": "Seal",
    "hair-oil": "Nourish",
    "pureheal-oil": "Wellness",
  },
  "pureheal-oil": {
    "pureheal-oil": "Wellness",
    "hair-oil": "Nourish",
    "hair-grease": "Seal",
  },
};

const DEFAULT_META: FbtSectionMeta = {
  title: "Frequently Bought Together",
  description: "Customers often pair these items. Add everything in one step.",
  legend: "Select items to add to your cart",
  helperText: "Recommended items selected — uncheck any you don't need.",
};

export function getFbtSectionMeta(anchorId: string): FbtSectionMeta {
  return SECTION_META[anchorId] ?? DEFAULT_META;
}

export function getRoutineStepLabel(
  anchorId: string,
  productId: string,
): string | undefined {
  return ROUTINE_STEPS[anchorId]?.[productId];
}

export function calculateFbtPricing(products: Product[]) {
  const subtotal = products.reduce((sum, product) => sum + product.price, 0);
  const qualifiesForDiscount =
    products.length >= 2 &&
    products.every((product) => FBT_DISCOUNT_ELIGIBLE_IDS.has(product.id));

  if (!qualifiesForDiscount) {
    return {
      subtotal,
      discount: 0,
      total: subtotal,
      qualifiesForDiscount: false,
    };
  }

  const discount =
    Math.round(subtotal * (FBT_BUNDLE_DISCOUNT_PERCENT / 100) * 100) / 100;
  const total = Math.round((subtotal - discount) * 100) / 100;

  return {
    subtotal,
    discount,
    total,
    qualifiesForDiscount: true,
  };
}

export function applyFbtUnitDiscount(unitPrice: number): number {
  return (
    Math.round(unitPrice * (1 - FBT_BUNDLE_DISCOUNT_PERCENT / 100) * 100) / 100
  );
}

/** Preview savings for cart items flagged from an FBT add. */
export function getCartFbtDiscountPreview(
  items: { productId: string; price: number; quantity: number; fbtDiscountEligible?: boolean }[],
) {
  const eligible = items.filter((item) => item.fbtDiscountEligible);
  const eligibleIds = eligible.map((item) => item.productId);

  if (!isValidFbtDiscountSet(eligibleIds)) return null;

  const subtotal = eligible.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount =
    Math.round(subtotal * (FBT_BUNDLE_DISCOUNT_PERCENT / 100) * 100) / 100;

  return { subtotal, discount, total: subtotal - discount };
}

/** Server-side: validate a set of product IDs qualifies for the FBT bundle discount. */
export function isValidFbtDiscountSet(productIds: string[]): boolean {
  const unique = [...new Set(productIds)];

  if (unique.length < 2) return false;
  if (unique.some((id) => !FBT_DISCOUNT_ELIGIBLE_IDS.has(id))) return false;

  const set = new Set(unique);

  if (set.has("hair-oil") && set.has("hair-grease")) return true;

  if (
    set.has("pureheal-oil") &&
    (set.has("hair-oil") || set.has("hair-grease"))
  ) {
    return true;
  }

  return false;
}
