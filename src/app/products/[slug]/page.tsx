import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { TrustBadges } from "@/components/layout/trust-badges";
import { BundleAccordions } from "@/components/bundle/bundle-accordions";
import { BundleAddToCartSection } from "@/components/bundle/bundle-add-to-cart-section";
import { AddToCartSection } from "@/components/product/add-to-cart-section";
import { ProductAccordions } from "@/components/product/product-accordions";
import { ProductGallery } from "@/components/product/product-gallery";
import { RelatedProducts } from "@/components/product/related-products";
import { StickyBuyBar } from "@/components/product/sticky-buy-bar";
import { categoryToCollection, siteConfig } from "@/config/site";
import {
  getAllBundleSlugs,
  getBundleBySlug,
  getBundleComponentProducts,
} from "@/lib/bundles";
import { getFrequentlyBoughtTogether } from "@/lib/product-recommendations";
import {
  getAllProductSlugs,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";
import {
  getBundleJsonLd,
  getBundleMetadata,
  getProductJsonLd,
  getProductMetadata,
} from "@/lib/seo";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const [productSlugs, bundleSlugs] = await Promise.all([
    getAllProductSlugs(),
    Promise.resolve(getAllBundleSlugs()),
  ]);
  return [...productSlugs, ...bundleSlugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const bundle = getBundleBySlug(slug);

  if (bundle) {
    const meta = await getBundleMetadata(bundle);
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
  const bundle = getBundleBySlug(slug);

  if (bundle) {
    const componentProducts = await getBundleComponentProducts(bundle);
    const jsonLd = getBundleJsonLd(bundle);

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
              { label: "Bundles", href: "/bundles" },
              { label: bundle.name },
            ]}
          />
          <div className="grid min-w-0 grid-gap lg:grid-cols-2">
            <div className="min-w-0">
              <ProductGallery images={bundle.images} productName={bundle.name} />
            </div>
            <BundleAddToCartSection
              bundle={bundle}
              componentProducts={componentProducts}
            />
          </div>
          <BundleAccordions
            bundle={bundle}
            componentProducts={componentProducts}
          />
        </PageContainer>
        <TrustBadges compact />
      </>
    );
  }

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
