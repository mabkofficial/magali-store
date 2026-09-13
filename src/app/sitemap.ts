import type { MetadataRoute } from "next";
import { getAllBundleSlugs } from "@/lib/bundles";
import { collections, getAllProductSlugs } from "@/lib/products";
import { siteConfig } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  const staticPages = [
    "",
    "/shop",
    "/bundles",
    "/about",
    "/faq",
    "/contact",
    "/shipping-returns",
    "/privacy",
    "/terms",
    "/cart",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const collectionPages = collections.map((collection) => ({
    url: `${baseUrl}/collections/${collection.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const [productSlugs, bundleSlugs] = await Promise.all([
    getAllProductSlugs(),
    Promise.resolve(getAllBundleSlugs()),
  ]);
  const productPages = [...productSlugs, ...bundleSlugs].map((slug) => ({
    url: `${baseUrl}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...collectionPages, ...productPages];
}
