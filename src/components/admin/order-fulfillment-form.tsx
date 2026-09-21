"use client";

import { useState } from "react";
import {
  markOrderFulfilled,
  markOrderProcessing,
  markOrderRefunded,
  markOrderShipped,
} from "@/app/admin/(dashboard)/orders/actions";
import { Button } from "@/components/ui/cms-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function OrderFulfillmentForm({
  orderId,
  status,
  trackingCarrier,
  trackingNumber,
}: {
  orderId: string;
  status: string;
  trackingCarrier: string | null;
  trackingNumber: string | null;
}) {
  const [carrier, setCarrier] = useState(trackingCarrier ?? "");
  const [tracking, setTracking] = useState(trackingNumber ?? "");
  const [sendEmail, setSendEmail] = useState(true);

  return (
    <div className="space-y-3">
      {status === "paid" && (
        <form action={markOrderProcessing}>
          <input type="hidden" name="orderId" value={orderId} />
          <Button type="submit" variant="outline" className="w-full">
            Mark processing
          </Button>
        </form>
      )}
      {(status === "paid" || status === "processing") && (
        <form className="space-y-3" action={markOrderShipped}>
          <input type="hidden" name="orderId" value={orderId} />
          <div className="space-y-2">
            <Label htmlFor="carrier">Carrier</Label>
            <Input
              id="carrier"
              name="trackingCarrier"
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              placeholder="USPS, UPS, FedEx…"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tracking">Tracking number</Label>
            <Input
              id="tracking"
              name="trackingNumber"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              name="sendShippedEmail"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
            />
            Email customer when marked shipped
          </label>
          <Button type="submit" className="w-full">
            Mark shipped
          </Button>
        </form>
      )}
      {status === "shipped" && (
        <form action={markOrderFulfilled}>
          <input type="hidden" name="orderId" value={orderId} />
          <Button type="submit" className="w-full">
            Mark fulfilled
          </Button>
        </form>
      )}
      {status !== "refunded" && (
        <form action={markOrderRefunded}>
          <input type="hidden" name="orderId" value={orderId} />
          <Button type="submit" variant="outline" className="w-full">
            Mark refunded
          </Button>
        </form>
      )}
    </div>
  );
}
