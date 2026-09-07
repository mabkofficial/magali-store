import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { TrustBadges } from "@/components/layout/trust-badges";
import { AddToCartSection } from "@/components/product/add-to-cart-section";
import { ProductAccordions } from "@/components/product/product-accordions";
import { ProductGallery } from "@/components/product/product-gallery";
import { RelatedProducts } from "@/components/product/related-products";
import { StickyBuyBar } from "@/components/product/sticky-buy-bar";
import { categoryToCollection } from "@/config/site";
import { getFrequentlyBoughtTogether } from "@/lib/product-recommendations";
import {
  getAllProductSlugs,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";
import { getProductMetadata, getProductJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  const meta = await getProductMetadata(product);
  const ogImage = meta.ogImage
    ? meta.ogImage.startsWith("http")
      ? meta.ogImage
      : `${siteConfig.url}${meta.ogImage}`
    : undefined;

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product);
  const fbtBundle = await getFrequentlyBoughtTogether(product);
  const jsonLd = getProductJsonLd(product);
  const collectionSlug = categoryToCollection[product.category];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageContainer pageY className="pb-24 lg:pb-12">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            {
              label: product.category,
              href: `/collections/${collectionSlug}`,
            },
            { label: product.shortName },
          ]}
        />
        <div className="grid min-w-0 grid-gap lg:grid-cols-2">
          <div className="min-w-0">
            <ProductGallery images={product.images} productName={product.name} />
          </div>
          <AddToCartSection product={product} fbtBundle={fbtBundle} />
        </div>
        <ProductAccordions product={product} />
        <RelatedProducts products={related} />
      </PageContainer>
      <TrustBadges compact />
      <StickyBuyBar product={product} />
    </>
  );
}
