export function getStandardShippingRateCents(): number {
  const value = process.env.STANDARD_SHIPPING_RATE_CENTS;
  return value ? parseInt(value, 10) : 799;
}

export function getFrozenShippingRateCents(): number {
  const value = process.env.FROZEN_SHIPPING_RATE_CENTS;
  return value ? parseInt(value, 10) : 2499;
}

export function formatShippingLabel(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
