import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  /** `sm` for mini-cart and compact surfaces; `md` for PDP and full cart */
  size?: "sm" | "md";
  className?: string;
  decreaseDisabled?: boolean;
}

export function QuantitySelector({
  quantity,
  onDecrease,
  onIncrease,
  size = "md",
  className,
  decreaseDisabled = false,
}: QuantitySelectorProps) {
  const isSmall = size === "sm";

  return (
    <div
      className={cn(
        "inline-flex items-stretch border border-border bg-surface",
        className,
      )}
      role="group"
      aria-label="Quantity"
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={decreaseDisabled || quantity <= 1}
        className={cn(
          "pressable inline-flex items-center justify-center text-ink transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink disabled:cursor-not-allowed disabled:opacity-40",
          isSmall ? "h-10 w-10" : "qty-btn",
        )}
        aria-label="Decrease quantity"
      >
        <Minus className={isSmall ? "h-3.5 w-3.5" : "h-4 w-4"} strokeWidth={1.5} />
      </button>
      <span
        className={cn(
          "flex min-w-10 items-center justify-center border-x border-border px-3 text-sm tabular-nums text-ink",
          isSmall ? "h-10" : "qty-btn w-10 px-0",
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        className={cn(
          "pressable inline-flex items-center justify-center text-ink transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink",
          isSmall ? "h-10 w-10" : "qty-btn",
        )}
        aria-label="Increase quantity"
      >
        <Plus className={isSmall ? "h-3.5 w-3.5" : "h-4 w-4"} strokeWidth={1.5} />
      </button>
    </div>
  );
}
