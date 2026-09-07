import { ProductsTable } from "@/components/admin/products-table";
import { getAdminClient } from "@/lib/supabase/admin";

export default async function AdminProductsPage() {
  const admin = getAdminClient();
  const { data: products } = admin
    ? await admin
        .from("products")
        .select(
          "id, slug, name, category, price, inventory_count, is_active, shipping_class, featured",
        )
        .order("name")
    : { data: [] };

  return (
    <div className="stack-md">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Products</h2>
        <p className="text-sm text-muted-foreground">
          Edit pricing, inventory, and product copy without redeploying.
        </p>
      </div>
      <ProductsTable products={products ?? []} />
    </div>
  );
}
