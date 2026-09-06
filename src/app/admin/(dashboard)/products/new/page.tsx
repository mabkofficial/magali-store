import { ProductEditor } from "@/components/admin/product-editor";
import { normalizeProductImages } from "@/lib/products/images";
import { getAdminClient } from "@/lib/supabase/admin";

export default async function AdminNewProductPage() {
  const admin = getAdminClient();
  const { data: allProducts } = admin
    ? await admin
        .from("products")
        .select("id, name, short_name, images, is_active")
        .order("name")
    : { data: [] };

  const fbtOptions =
    allProducts?.map((row) => ({
      id: row.id,
      name: row.name,
      short_name: row.short_name,
      images: normalizeProductImages(row.images),
      is_active: row.is_active,
    })) ?? [];

  return <ProductEditor mode="create" fbtOptions={fbtOptions} />;
}
