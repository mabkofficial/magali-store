import type { Product } from "@/types/product";
import { siteConfig } from "@/config/site";

export function getProductMetadata(product: Product) {
  const titles: Record<string, string> = {
    "magali-botanical-hair-oil":
      "Magali Botanical Hair Oil 8.5 fl oz | Nourish, Strengthen & Shine",
    "magali-herbal-hair-grease":
      "Magali Herbal Hair Grease | Botanical Hair & Scalp Care",
    "magali-pureheal-oil":
      "Magali PureHeal Oil 60 ml | Castor & Clove Botanical Oil",
    "magali-caribbean-style-beef-pies-8-pack":
      "Magali Caribbean Style Beef Pies 8 Pack | 32 oz",
  };

  return {
    title: titles[product.slug] ?? product.name,
    description: product.shortDescription,
  };
}

export function getProductJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images.map(
      (image) => `${siteConfig.url}${image}`,
    ),
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
      availability: "https://schema.org/InStock",
    },
  };
}
