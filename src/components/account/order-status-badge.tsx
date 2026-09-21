import { cn } from "@/lib/utils";

const labels: Record<string, string> = {
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  fulfilled: "Delivered",
  refunded: "Refunded",
};

export function CustomerOrderStatusBadge({ status }: { status: string }) {
  const label = labels[status] ?? status;
  const tone =
    status === "refunded"
      ? "text-destructive border-destructive/30"
      : status === "shipped" || status === "fulfilled"
        ? "text-botanical border-botanical/30"
        : "text-muted border-border";

  return (
    <span
      className={cn(
        "inline-flex border px-2 py-0.5 text-[10px] uppercase tracking-[0.1em]",
        tone,
      )}
    >
      {label}
    </span>
  );
}
