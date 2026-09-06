export const ORDER_STATUS_LABELS: Record<string, string> = {
  paid: "Paid",
  fulfilled: "Fulfilled",
  refunded: "Refunded",
};

export const ORDER_STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  paid: "secondary",
  fulfilled: "default",
  refunded: "destructive",
};
