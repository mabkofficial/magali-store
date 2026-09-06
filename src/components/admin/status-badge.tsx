import { Badge } from "@/components/ui/cms-badge";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_VARIANT,
} from "@/lib/admin/statuses";

export function OrderStatusBadge({ status }: { status: string }) {
  const variant = ORDER_STATUS_VARIANT[status] ?? "outline";
  const label = ORDER_STATUS_LABELS[status] ?? status;

  return (
    <Badge variant={variant} className="text-[10px] uppercase tracking-wider">
      {label}
    </Badge>
  );
}
