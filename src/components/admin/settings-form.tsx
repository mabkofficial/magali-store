"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateStoreSettings } from "@/app/admin/(dashboard)/settings/actions";
import { Button } from "@/components/ui/cms-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { StoreSettings } from "@/types/product";

export function SettingsForm({
  settings,
  fields,
}: {
  settings: StoreSettings;
  fields: "general" | "shipping" | "seo";
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await updateStoreSettings(formData);
          if (result?.error) {
            toast.error(result.error);
            return;
          }
          toast.success("Settings saved");
        });
      }}
      className="space-y-6"
    >
      {fields === "general" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">General</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="store_name">Store name</Label>
              <Input
                id="store_name"
                name="store_name"
                defaultValue={settings.storeName}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact email</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                defaultValue={settings.contactEmail ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact phone</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                defaultValue={settings.contactPhone ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social_instagram">Instagram URL</Label>
              <Input
                id="social_instagram"
                name="social_instagram"
                defaultValue={settings.socialInstagram ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social_facebook">Facebook URL</Label>
              <Input
                id="social_facebook"
                name="social_facebook"
                defaultValue={settings.socialFacebook ?? ""}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {fields === "shipping" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Shipping rates</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="standard_shipping_cents">Standard (cents)</Label>
              <Input
                id="standard_shipping_cents"
                name="standard_shipping_cents"
                type="number"
                min="0"
                defaultValue={settings.standardShippingCents}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frozen_shipping_cents">Frozen (cents)</Label>
              <Input
                id="frozen_shipping_cents"
                name="frozen_shipping_cents"
                type="number"
                min="0"
                defaultValue={settings.frozenShippingCents}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="shipping_regions">Regions copy</Label>
              <Input
                id="shipping_regions"
                name="shipping_regions"
                defaultValue={settings.shippingRegions}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {fields === "seo" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">SEO defaults</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default_meta_description">Default meta description</Label>
              <Input
                id="default_meta_description"
                name="default_meta_description"
                defaultValue={settings.defaultMetaDescription ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default_og_image">Default OG image URL</Label>
              <Input
                id="default_og_image"
                name="default_og_image"
                defaultValue={settings.defaultOgImage ?? ""}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Live sitemap:{" "}
              <a href="/sitemap.xml" target="_blank" className="underline">
                /sitemap.xml
              </a>
            </p>
          </CardContent>
        </Card>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
