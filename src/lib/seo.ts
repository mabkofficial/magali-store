import type { Product } from "@/types/product";
import { getPrimaryImageUrl } from "@/lib/products/images";
import { siteConfig } from "@/config/site";
import { getStoreSettings } from "@/lib/store-settings";

function toAbsoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function getProductMetadata(product: Product) {
  const settings = await getStoreSettings();

  return {
    title: product.metaTitle ?? product.name,
    description:
      product.metaDescription ??
      product.shortDescription ??
      settings?.defaultMetaDescription ??
      siteConfig.description,
    ogImage:
      product.ogImage ??
      getPrimaryImageUrl(product.images) ??
      settings?.defaultOgImage ??
      undefined,
  };
}

export function getProductJsonLd(product: Product) {
  const imageUrls = product.images.map((image) => toAbsoluteUrl(image.url));
  const primary = getPrimaryImageUrl(product.images);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.metaDescription ?? product.shortDescription,
    image:
      imageUrls.length > 0
        ? imageUrls
        : primary
          ? [toAbsoluteUrl(primary)]
          : [],
    brand: {
      "@type": "Brand",
      name: "Magali",
    },
    sku: product.id,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      url: `${siteConfig.url}/products/${product.slug}`,
      availability:
        product.inventoryCount <= 0
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
    },
  };
}
