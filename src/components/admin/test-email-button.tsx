"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function TestEmailButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/test-email", { method: "POST" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Test email failed");
      }
      toast.success("Test email sent. Check your inbox.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Test email failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="button" variant="outline" onClick={handleClick} disabled={loading}>
      {loading ? "Sending…" : "Send test email"}
    </Button>
  );
}
