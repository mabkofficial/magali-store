"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { getReorderPayload } from "@/app/account/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import { getBundleById } from "@/lib/bundles/catalog";
import { getProductByIdSync } from "@/lib/products/sync";
import { useCartStore } from "@/store/cart-store";

export function ReorderButton({ orderId }: { orderId: string }) {
  const [pending, setPending] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const addBundle = useCartStore((s) => s.addBundle);
  const openCart = useCartStore((s) => s.openCart);
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="outline"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        const result = await getReorderPayload(orderId);
        if ("error" in result) {
          toast.error(result.error);
          setPending(false);
          return;
        }
        if (!result.items.length) {
          toast.error("No items from this order are available to reorder.");
          setPending(false);
          return;
        }
        let added = 0;
        for (const entry of result.items) {
          if (entry.type === "bundle") {
            const bundle = getBundleById(entry.id);
            if (bundle) {
              addBundle(bundle, entry.quantity);
              added += 1;
            }
          } else {
            const product = getProductByIdSync(entry.id);
            if (product?.isActive && product.inventoryCount > 0) {
              addItem(product, entry.quantity);
              added += 1;
            }
          }
        }
        setPending(false);
        if (added === 0) {
          toast.error("Items in this order are no longer available.");
          return;
        }
        toast.success("Added to cart");
        openCart();
        router.push("/cart");
      }}
    >
      {pending ? "Adding…" : "Reorder"}
    </Button>
  );
}
