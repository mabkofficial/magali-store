"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  createProduct,
  deleteProduct,
  duplicateProduct,
  updateProduct,
} from "@/app/admin/(dashboard)/products/actions";
import { slugify, type ProductEditorState } from "@/lib/admin/product-form";
import { FbtProductPicker, type FbtProductOption } from "@/components/admin/fbt-product-picker";
import { ProductGalleryManager } from "@/components/admin/product-gallery-manager";
import { Button } from "@/components/ui/cms-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPrimaryImageUrl } from "@/lib/products/images";
import type { ProductDirections, ProductIngredients } from "@/types/product";

function StringListEditor({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={value}
              placeholder={placeholder}
              onChange={(event) => {
                const next = [...values];
                next[index] = event.target.value;
                onChange(next);
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onChange(values.filter((_, i) => i !== index))}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...values, ""])}
      >
        <Plus className="size-4" />
        Add row
      </Button>
    </div>
  );
}

function IngredientsEditor({
  value,
  onChange,
}: {
  value: ProductIngredients;
  onChange: (value: ProductIngredients) => void;
}) {
  const groups = Object.entries(value);

  return (
    <div className="space-y-4">
      {groups.map(([groupName, items], groupIndex) => (
        <Card key={`${groupName}-${groupIndex}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Input
                value={groupName}
                onChange={(event) => {
                  const next: ProductIngredients = {};
                  groups.forEach(([name, list], index) => {
                    const key = index === groupIndex ? event.target.value : name;
                    next[key] = list;
                  });
                  onChange(next);
                }}
                placeholder="Group name"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  const next = { ...value };
                  delete next[groupName];
                  onChange(next);
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <StringListEditor
              label="Items"
              values={items}
              onChange={(items) => onChange({ ...value, [groupName]: items })}
              placeholder="Ingredient"
            />
          </CardContent>
        </Card>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange({ ...value, [`group-${groups.length + 1}`]: [""] })}
      >
        <Plus className="size-4" />
        Add group
      </Button>
    </div>
  );
}

function emptyProduct(): ProductEditorState {
  return {
    name: "",
    slug: "",
    short_name: "",
    category: "Hair Care",
    price: 0,
    currency: "USD",
    size: "",
    shipping_class: "standard",
    featured: false,
    is_active: false,
    inventory_count: 0,
    tagline: "",
    short_description: "",
    overview: "",
    benefits: [""],
    claims: [],
    nutrition_highlights: [],
    ingredients: { main: [""] },
    directions: [""],
    caution: "",
    storage: "",
    compliance_note: "",
    verification_note: "",
    images: [],
    meta_title: "",
    meta_description: "",
    og_image: "",
    fbt_product_ids: [],
  };
}

export function ProductEditor({
  product: initial,
  mode = "edit",
  fbtOptions = [],
}: {
  product?: ProductEditorState;
  mode?: "create" | "edit";
  fbtOptions?: FbtProductOption[];
}) {
  const [form, setForm] = useState<ProductEditorState>(initial ?? emptyProduct());
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const isFood = form.category === "Food";
  const isCreate = mode === "create";

  const seoTitle = form.meta_title || form.name || "Product title";
  const seoDescription =
    form.meta_description || form.short_description || "Product description";
  const seoImage =
    form.og_image || getPrimaryImageUrl(form.images) || "/images/og-default.png";

  const cleanedPayload = useMemo(() => {
    const directions: ProductDirections = isFood
      ? {
          oven: typeof form.directions === "object" && !Array.isArray(form.directions)
            ? form.directions.oven
            : "",
          airFryer:
            typeof form.directions === "object" && !Array.isArray(form.directions)
              ? form.directions.airFryer
              : "",
          skillet:
            typeof form.directions === "object" && !Array.isArray(form.directions)
              ? form.directions.skillet
              : "",
        }
      : (form.directions as string[]).filter(Boolean);

    return {
      ...form,
      benefits: form.benefits.filter(Boolean),
      claims: form.claims?.filter(Boolean) ?? [],
      nutrition_highlights: form.nutrition_highlights?.filter(Boolean) ?? [],
      ingredients: Object.fromEntries(
        Object.entries(form.ingredients)
          .filter(([key]) => key.trim())
          .map(([key, items]) => [key, items.filter(Boolean)]),
      ),
      directions,
      compliance_note: form.compliance_note || null,
      verification_note: form.verification_note || null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      og_image: form.og_image || null,
    };
  }, [form, isFood]);

  const save = () => {
    startTransition(async () => {
      const result = isCreate
        ? await createProduct(cleanedPayload, form.fbt_product_ids)
        : await updateProduct(form.id!, cleanedPayload, form.fbt_product_ids);

      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(isCreate ? "Product created" : "Product saved");
    });
  };

  const setField = <K extends keyof ProductEditorState>(
    key: K,
    value: ProductEditorState[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/products"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to products
          </Link>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            {isCreate ? "New product" : form.name}
          </h2>
          {!isCreate && (
            <p className="text-sm text-muted-foreground">{form.slug}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {!isCreate && (
            <>
              <Link
                href={`/products/${form.slug}`}
                target="_blank"
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium hover:bg-muted"
              >
                <ExternalLink className="size-4" />
                View live
              </Link>
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await duplicateProduct(form.id!);
                    if (result?.error) toast.error(result.error);
                  })
                }
              >
                Duplicate
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await deleteProduct(form.id!);
                    if (result?.error) {
                      toast.error(result.error);
                      return;
                    }
                    toast.success("Product deactivated");
                    router.push("/admin/products");
                  })
                }
              >
                Deactivate
              </Button>
            </>
          )}
          <Button type="button" disabled={pending} onClick={save}>
            {pending ? "Saving…" : isCreate ? "Create product" : "Save changes"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basics">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="copy">Copy</TabsTrigger>
          <TabsTrigger value="merch">Merchandising</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="directions">Directions</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basics</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(event) => {
                    const name = event.target.value;
                    setForm((current) => ({
                      ...current,
                      name,
                      slug: isCreate && !current.slug ? slugify(name) : current.slug,
                      short_name:
                        isCreate && !current.short_name ? name : current.short_name,
                    }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(event) => setField("slug", slugify(event.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="short_name">Short name</Label>
                <Input
                  id="short_name"
                  value={form.short_name}
                  onChange={(event) => setField("short_name", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                  value={form.category}
                  onChange={(event) =>
                    setField("category", event.target.value as ProductEditorState["category"])
                  }
                >
                  <option value="Hair Care">Hair Care</option>
                  <option value="Wellness">Wellness</option>
                  <option value="Food">Food</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  value={form.size}
                  onChange={(event) => setField("size", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price || ""}
                  onChange={(event) => setField("price", Number(event.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inventory_count">Inventory</Label>
                <Input
                  id="inventory_count"
                  type="number"
                  min="0"
                  value={form.inventory_count}
                  onChange={(event) =>
                    setField("inventory_count", Number(event.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipping_class">Shipping class</Label>
                <select
                  id="shipping_class"
                  className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                  value={form.shipping_class}
                  onChange={(event) =>
                    setField(
                      "shipping_class",
                      event.target.value as ProductEditorState["shipping_class"],
                    )
                  }
                >
                  <option value="standard">Standard</option>
                  <option value="frozen">Frozen</option>
                </select>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3 sm:col-span-2">
                <div>
                  <p className="text-sm font-medium">Active on storefront</p>
                  <p className="text-xs text-muted-foreground">
                    Inactive products are hidden from shop pages.
                  </p>
                </div>
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(checked) => setField("is_active", checked)}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3 sm:col-span-2">
                <div>
                  <p className="text-sm font-medium">Featured</p>
                  <p className="text-xs text-muted-foreground">
                    Show on homepage featured sections.
                  </p>
                </div>
                <Switch
                  checked={form.featured}
                  onCheckedChange={(checked) => setField("featured", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="copy" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Copy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={form.tagline}
                  onChange={(event) => setField("tagline", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="short_description">Short description</Label>
                <Textarea
                  id="short_description"
                  rows={3}
                  value={form.short_description}
                  onChange={(event) => setField("short_description", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="overview">Overview</Label>
                <Textarea
                  id="overview"
                  rows={8}
                  value={form.overview}
                  onChange={(event) => setField("overview", event.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="merch" className="mt-4 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <StringListEditor
                label="Benefits"
                values={form.benefits.length ? form.benefits : [""]}
                onChange={(benefits) => setField("benefits", benefits)}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <StringListEditor
                label="Claims / badges"
                values={form.claims ?? []}
                onChange={(claims) => setField("claims", claims)}
                placeholder="Paraben-Free"
              />
            </CardContent>
          </Card>
          {isFood && (
            <Card>
              <CardContent className="pt-6">
                <StringListEditor
                  label="Nutrition highlights"
                  values={form.nutrition_highlights ?? []}
                  onChange={(nutrition_highlights) =>
                    setField("nutrition_highlights", nutrition_highlights)
                  }
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Frequently bought together</CardTitle>
              <CardDescription>
                Companion products shown in the bundle widget on the product page
                and in cart suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FbtProductPicker
                productId={form.id}
                options={fbtOptions}
                selectedIds={form.fbt_product_ids}
                onChange={(fbt_product_ids) =>
                  setField("fbt_product_ids", fbt_product_ids)
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ingredients" className="mt-4">
          <IngredientsEditor
            value={form.ingredients}
            onChange={(ingredients) => setField("ingredients", ingredients)}
          />
        </TabsContent>

        <TabsContent value="directions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Directions</CardTitle>
              <CardDescription>
                {isFood
                  ? "Food products use oven, air fryer, and skillet fields."
                  : "Hair and wellness products use a bullet list."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isFood ? (
                <div className="grid gap-4">
                  {(["oven", "airFryer", "skillet"] as const).map((key) => (
                    <div key={key} className="space-y-2">
                      <Label>{key === "airFryer" ? "Air fryer" : key}</Label>
                      <Textarea
                        rows={3}
                        value={
                          typeof form.directions === "object" &&
                          !Array.isArray(form.directions)
                            ? form.directions[key]
                            : ""
                        }
                        onChange={(event) => {
                          const current =
                            typeof form.directions === "object" &&
                            !Array.isArray(form.directions)
                              ? form.directions
                              : { oven: "", airFryer: "", skillet: "" };
                          setField("directions", {
                            ...current,
                            [key]: event.target.value,
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <StringListEditor
                  label="Steps"
                  values={Array.isArray(form.directions) ? form.directions : [""]}
                  onChange={(directions) => setField("directions", directions)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="mt-4">
          <Card>
            <CardContent className="grid gap-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="caution">Caution</Label>
                <Textarea
                  id="caution"
                  rows={3}
                  value={form.caution}
                  onChange={(event) => setField("caution", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storage">Storage</Label>
                <Textarea
                  id="storage"
                  rows={3}
                  value={form.storage}
                  onChange={(event) => setField("storage", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="compliance_note">Compliance note</Label>
                <Textarea
                  id="compliance_note"
                  rows={3}
                  value={form.compliance_note ?? ""}
                  onChange={(event) => setField("compliance_note", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="verification_note">Verification note</Label>
                <Textarea
                  id="verification_note"
                  rows={3}
                  value={form.verification_note ?? ""}
                  onChange={(event) =>
                    setField("verification_note", event.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Gallery</CardTitle>
              <CardDescription>
                First image is the hero on product cards and PDP.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductGalleryManager
                productId={(form.id ?? form.slug) || "new-product"}
                images={form.images}
                onChange={(images) => setField("images", images)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="mt-4 space-y-4">
          <Card>
            <CardContent className="grid gap-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta title</Label>
                <Input
                  id="meta_title"
                  value={form.meta_title ?? ""}
                  onChange={(event) => setField("meta_title", event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {(form.meta_title ?? form.name).length} characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta description</Label>
                <Textarea
                  id="meta_description"
                  rows={4}
                  value={form.meta_description ?? ""}
                  onChange={(event) =>
                    setField("meta_description", event.target.value)
                  }
                />
                <p className="text-xs text-muted-foreground">
                  {(form.meta_description ?? form.short_description).length} characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="og_image">OG image override</Label>
                <Input
                  id="og_image"
                  value={form.og_image ?? ""}
                  onChange={(event) => setField("og_image", event.target.value)}
                  placeholder="Leave blank to use first gallery image"
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Search preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-base text-[#1a0dab]">{seoTitle}</p>
              <p className="text-sm text-[#006621]">
                magali.com/products/{form.slug || "product-slug"}
              </p>
              <p className="text-sm text-muted-foreground">{seoDescription}</p>
              {seoImage && (
                <p className="truncate text-xs text-muted-foreground">{seoImage}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
