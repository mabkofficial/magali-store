export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function toCents(amount: number): number {
  return Math.round(amount * 100);
}
