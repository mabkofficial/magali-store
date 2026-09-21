export const ORDER_STATUS_LABELS: Record<string, string> = {
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  fulfilled: "Fulfilled",
  refunded: "Refunded",
};

export const ORDER_STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  paid: "secondary",
  processing: "secondary",
  shipped: "default",
  fulfilled: "default",
  refunded: "destructive",
};

export type AdminOrderStatus =
  | "paid"
  | "processing"
  | "shipped"
  | "fulfilled"
  | "refunded";
