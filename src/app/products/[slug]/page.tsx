import { notFound } from "next/navigation";
import { AddToCartSection } from "@/components/product/add-to-cart-section";
import { ProductAccordions } from "@/components/product/product-accordions";
import { ProductGallery } from "@/components/product/product-gallery";
import { RelatedProducts } from "@/components/product/related-products";
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[58%_42%]">
          <ProductGallery images={product.images} productName={product.name} />
          <AddToCartSection product={product} />
        </div>
        <ProductAccordions product={product} />
        <RelatedProducts products={related} />
      </div>
    </>
  );
}
