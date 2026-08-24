import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { AddToCartSection } from "@/components/product/add-to-cart-section";
import { ProductAccordions } from "@/components/product/product-accordions";
import { ProductGallery } from "@/components/product/product-gallery";
import { RelatedProducts } from "@/components/product/related-products";
import { StickyBuyBar } from "@/components/product/sticky-buy-bar";
import { categoryToCollection } from "@/config/site";
import {
  getAllProductSlugs,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";
import { getProductJsonLd, getProductMetadata } from "@/lib/seo";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  const meta = getProductMetadata(product);
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      images: product.images.map((image) => ({ url: image })),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product);
  const jsonLd = getProductJsonLd(product);
  const collectionSlug = categoryToCollection[product.category];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageContainer className="py-10 pb-24 sm:py-12 lg:pb-12 lg:py-16">
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
        <div className="grid min-w-0 gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <ProductGallery images={product.images} productName={product.name} />
          </div>
          <AddToCartSection product={product} />
        </div>
        <ProductAccordions product={product} />
        <RelatedProducts products={related} />
      </PageContainer>
      <StickyBuyBar product={product} />
    </>
  );
}
