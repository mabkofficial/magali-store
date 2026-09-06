"use client";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export function EmailSignup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "homepage" }),
      });

      if (!response.ok) {
        throw new Error("Subscription failed");
      }

      toast.success("You are subscribed.");
      setEmail("");
    } catch {
      toast.error("Unable to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-ink text-surface">
      <PageContainer className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-lg text-center">
          <p className="eyebrow text-surface/60">Stay connected</p>
          <h2 className="mt-3 font-display text-3xl lg:text-4xl">Newsletter</h2>
          <p className="mt-4 text-sm text-surface/70">
            Product news and updates, sent occasionally. Unsubscribe anytime.
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
              className="min-w-0 flex-1 border border-surface/30 bg-transparent px-4 py-3 text-sm text-surface placeholder:text-surface/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-surface"
              aria-label="Email address"
            />
            <Button
              type="submit"
              variant="outline"
              size="md"
              disabled={loading}
              className="shrink-0 border-surface text-surface hover:bg-surface hover:text-ink"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </div>
      </PageContainer>
    </section>
  );
}
