import { notFound } from "next/navigation";
import { ProductEditor } from "@/components/admin/product-editor";
import { dbRowToFormState } from "@/lib/admin/product-form";
import { getFbtProductIdsForAdmin } from "@/lib/product-recommendations";
import { normalizeProductImages } from "@/lib/products/images";
import { getAdminClient } from "@/lib/supabase/admin";

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = getAdminClient();
  if (!admin) notFound();

  const [{ data: product }, { data: allProducts }, fbtProductIds] =
    await Promise.all([
      admin.from("products").select("*").eq("id", id).single(),
      admin
        .from("products")
        .select("id, name, short_name, images, is_active")
        .order("name"),
      getFbtProductIdsForAdmin(id),
    ]);

  if (!product) notFound();

  const fbtOptions =
    allProducts?.map((row) => ({
      id: row.id,
      name: row.name,
      short_name: row.short_name,
      images: normalizeProductImages(row.images),
      is_active: row.is_active,
    })) ?? [];

  return (
    <ProductEditor
      product={{ ...dbRowToFormState(product), fbt_product_ids: fbtProductIds }}
      fbtOptions={fbtOptions}
      mode="edit"
    />
  );
}
