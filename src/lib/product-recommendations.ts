import { getAdminClient } from "@/lib/supabase/admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getAllProducts, getProductById } from "@/lib/products";
import type { FbtBundle, Product } from "@/types/product";

export const FBT_MAX_COMPANIONS = 3;
export const CO_PURCHASE_MIN_OCCURRENCES = 2;
const CURATED_BASE_SCORE = 10_000;
const CO_PURCHASE_SCORE_MULTIPLIER = 100;

export type RelationshipType = "fbt" | "related";

type ScoredProductId = {
  productId: string;
  score: number;
  source: "curated" | "co_purchase" | "both";
};

/** Fallback curated pairs when Supabase is unavailable */
const FALLBACK_FBT_MAP: Record<string, string[]> = {
  "hair-oil": ["hair-grease"],
  "hair-grease": ["hair-oil"],
  "pureheal-oil": ["hair-oil", "hair-grease"],
};

async function getSupabaseReader() {
  const admin = getAdminClient();
  if (admin) return admin;
  return createClient();
}

function isEligibleCompanion(product: Product, anchorId: string): boolean {
  return (
    product.id !== anchorId &&
    product.isActive &&
    product.inventoryCount > 0
  );
}

async function getCuratedRelationships(
  sourceProductId: string,
  relationshipType: RelationshipType = "fbt",
): Promise<{ targetProductId: string; sortOrder: number }[]> {
  if (!isSupabaseConfigured()) {
    const fallback = FALLBACK_FBT_MAP[sourceProductId] ?? [];
    return fallback.map((targetProductId, index) => ({
      targetProductId,
      sortOrder: index,
    }));
  }

  const supabase = await getSupabaseReader();
  const { data, error } = await supabase
    .from("product_relationships")
    .select("target_product_id, sort_order")
    .eq("source_product_id", sourceProductId)
    .eq("relationship_type", relationshipType)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    const fallback = FALLBACK_FBT_MAP[sourceProductId] ?? [];
    return fallback.map((targetProductId, index) => ({
      targetProductId,
      sortOrder: index,
    }));
  }

  return data.map((row) => ({
    targetProductId: row.target_product_id,
    sortOrder: row.sort_order,
  }));
}

async function getCoPurchaseScores(
  sourceProductId: string,
  limit = 10,
): Promise<{ productId: string; count: number }[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await getSupabaseReader();
  const { data, error } = await supabase.rpc("get_co_purchase_recommendations", {
    p_product_id: sourceProductId,
    p_limit: limit,
  });

  if (error || !data) return [];

  return (data as { target_product_id: string; co_occurrence_count: number }[]).map(
    (row) => ({
      productId: row.target_product_id,
      count: Number(row.co_occurrence_count),
    }),
  );
}

function mergeScores(
  curated: { targetProductId: string; sortOrder: number }[],
  coPurchase: { productId: string; count: number }[],
): ScoredProductId[] {
  const scoreMap = new Map<string, ScoredProductId>();

  for (const { targetProductId, sortOrder } of curated) {
    scoreMap.set(targetProductId, {
      productId: targetProductId,
      score: CURATED_BASE_SCORE - sortOrder,
      source: "curated",
    });
  }

  for (const { productId, count } of coPurchase) {
    if (count < CO_PURCHASE_MIN_OCCURRENCES) continue;

    const coScore = count * CO_PURCHASE_SCORE_MULTIPLIER;
    const existing = scoreMap.get(productId);

    if (existing) {
      existing.score += coScore;
      existing.source = "both";
    } else {
      scoreMap.set(productId, {
        productId,
        score: coScore,
        source: "co_purchase",
      });
    }
  }

  return [...scoreMap.values()].sort((a, b) => b.score - a.score);
}

async function resolveProducts(
  anchorId: string,
  scoredIds: ScoredProductId[],
  limit: number,
): Promise<Product[]> {
  const products = await getAllProducts();
  const productMap = new Map(products.map((product) => [product.id, product]));

  const companions: Product[] = [];

  for (const { productId } of scoredIds) {
    const product = productMap.get(productId);
    if (!product || !isEligibleCompanion(product, anchorId)) continue;
    companions.push(product);
    if (companions.length >= limit) break;
  }

  return companions;
}

export async function getFrequentlyBoughtTogether(
  anchor: Product,
  limit = FBT_MAX_COMPANIONS,
): Promise<FbtBundle | null> {
  const [curated, coPurchase] = await Promise.all([
    getCuratedRelationships(anchor.id, "fbt"),
    getCoPurchaseScores(anchor.id, limit * 3),
  ]);

  const scored = mergeScores(curated, coPurchase);
  const companions = await resolveProducts(anchor.id, scored, limit);

  if (companions.length === 0) return null;

  return { anchor, companions };
}

export async function getFrequentlyBoughtTogetherById(
  anchorId: string,
  limit = FBT_MAX_COMPANIONS,
): Promise<FbtBundle | null> {
  const anchor = await getProductById(anchorId);
  if (!anchor) return null;
  return getFrequentlyBoughtTogether(anchor, limit);
}

export async function getCartFbtSuggestions(
  cartProductIds: string[],
  limit = FBT_MAX_COMPANIONS,
): Promise<Product[]> {
  if (cartProductIds.length === 0) return [];

  const cartSet = new Set(cartProductIds);
  const aggregateScores = new Map<string, number>();

  for (const productId of cartProductIds) {
    const [curated, coPurchase] = await Promise.all([
      getCuratedRelationships(productId, "fbt"),
      getCoPurchaseScores(productId, limit * 2),
    ]);

    const scored = mergeScores(curated, coPurchase);
    for (const { productId: targetId, score } of scored) {
      if (cartSet.has(targetId)) continue;
      aggregateScores.set(
        targetId,
        (aggregateScores.get(targetId) ?? 0) + score,
      );
    }
  }

  const ranked: ScoredProductId[] = [...aggregateScores.entries()]
    .map(([productId, score]) => ({
      productId,
      score,
      source: "both" as const,
    }))
    .sort((a, b) => b.score - a.score);

  const products = await getAllProducts();
  const productMap = new Map(products.map((product) => [product.id, product]));
  const suggestions: Product[] = [];

  for (const { productId } of ranked) {
    const product = productMap.get(productId);
    if (!product || !product.isActive || product.inventoryCount <= 0) continue;
    if (cartSet.has(product.id)) continue;
    suggestions.push(product);
    if (suggestions.length >= limit) break;
  }

  return suggestions;
}

export async function getFbtProductIdsForAdmin(
  sourceProductId: string,
): Promise<string[]> {
  const relationships = await getCuratedRelationships(sourceProductId, "fbt");
  return relationships.map((rel) => rel.targetProductId);
}

export async function syncFbtRelationships(
  admin: NonNullable<ReturnType<typeof getAdminClient>>,
  sourceProductId: string,
  targetProductIds: string[],
) {
  const uniqueTargets = [...new Set(targetProductIds.filter((id) => id !== sourceProductId))];

  await admin
    .from("product_relationships")
    .delete()
    .eq("source_product_id", sourceProductId)
    .eq("relationship_type", "fbt");

  if (uniqueTargets.length === 0) return;

  await admin.from("product_relationships").insert(
    uniqueTargets.map((targetProductId, index) => ({
      source_product_id: sourceProductId,
      target_product_id: targetProductId,
      relationship_type: "fbt",
      sort_order: index,
    })),
  );
}

export async function copyProductRelationships(
  admin: NonNullable<ReturnType<typeof getAdminClient>>,
  sourceProductId: string,
  newProductId: string,
) {
  const { data } = await admin
    .from("product_relationships")
    .select("target_product_id, relationship_type, sort_order")
    .eq("source_product_id", sourceProductId);

  if (!data?.length) return;

  await admin.from("product_relationships").insert(
    data
      .filter((rel) => rel.target_product_id !== newProductId)
      .map((rel) => ({
        source_product_id: newProductId,
        target_product_id: rel.target_product_id,
        relationship_type: rel.relationship_type,
        sort_order: rel.sort_order,
      })),
  );
}
