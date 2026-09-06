"use client";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { FBT_BUNDLE_DISCOUNT_PERCENT } from "@/lib/fbt-config";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

interface EmailSignupProps {
  source?: string;
  showIncentive?: boolean;
  variant?: "dark" | "light";
  className?: string;
}

export function EmailSignup({
  source = "homepage",
  showIncentive = true,
  variant = "dark",
  className,
}: EmailSignupProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const isDark = variant === "dark";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source,
          promoInterest: showIncentive,
        }),
      });

      if (!response.ok) {
        throw new Error("Subscription failed");
      }

      const incentiveMessage = showIncentive
        ? `You're subscribed — build a routine bundle and save ${FBT_BUNDLE_DISCOUNT_PERCENT}% at checkout.`
        : "You are subscribed.";

      toast.success(incentiveMessage);
      setEmail("");
    } catch {
      toast.error("Unable to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <div className={cn("mx-auto max-w-lg text-center", className)}>
      <p className={cn("eyebrow", isDark ? "text-surface/60" : "text-botanical")}>
        Stay connected
      </p>
      <h2
        className={cn(
          "mt-3 font-display text-3xl lg:text-4xl",
          isDark ? "text-surface" : "text-ink",
        )}
      >
        {showIncentive ? "Save on your first routine" : "Newsletter"}
      </h2>
      <p
        className={cn(
          "mt-4 text-sm",
          isDark ? "text-surface/70" : "text-muted",
        )}
      >
        {showIncentive ? (
          <>
            Subscribe for product news and get{" "}
            <strong className="font-medium">
              {FBT_BUNDLE_DISCOUNT_PERCENT}% off
            </strong>{" "}
            when you add a hair care routine bundle at checkout. Unsubscribe
            anytime.
          </>
        ) : (
          "Product news and updates, sent occasionally. Unsubscribe anytime."
        )}
      </p>
      <form
        className="mt-8 flex flex-col gap-3 sm:flex-row"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className={cn(
            "min-w-0 flex-1 border px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-1",
            isDark
              ? "border-surface/30 bg-transparent text-surface placeholder:text-surface/40 focus-visible:ring-surface"
              : "border-border bg-surface text-ink placeholder:text-muted-light focus-visible:ring-ink",
          )}
          aria-label="Email address"
        />
        <Button
          type="submit"
          variant="outline"
          size="md"
          disabled={loading}
          className={cn(
            "shrink-0",
            isDark
              ? "border-surface text-surface hover:bg-surface hover:text-ink"
              : "border-ink text-ink hover:bg-surface-muted",
          )}
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
    </div>
  );

  if (variant === "light") {
    return (
      <section className="border border-border bg-surface-muted p-6 sm:p-8">
        {content}
      </section>
    );
  }

  return (
    <section className="bg-ink text-surface">
      <PageContainer className="py-12 sm:py-16 lg:py-20">{content}</PageContainer>
    </section>
  );
}
