"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to send message");
      }

      toast.success("Message sent successfully!");
      event.currentTarget.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to send message",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-16 lg:px-8">
      <h1 className="font-display text-4xl font-semibold text-magali-green-950">
        Contact Us
      </h1>
      <p className="mt-4 text-magali-ink/60">
        Have a question about our products or need help with an order? Send us a
        message and we will get back to you.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

        <div>
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" required />
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" required />
        </div>

        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>

        <div>
          <Label htmlFor="subject">Subject *</Label>
          <Select id="subject" name="subject" required defaultValue="">
            <option value="" disabled>
              Select a subject
            </option>
            <option value="product">Product Question</option>
            <option value="order">Order Inquiry</option>
            <option value="frozen">Frozen Food Order</option>
            <option value="other">Other</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="message">Message *</Label>
          <Textarea id="message" name="message" rows={5} required />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}
