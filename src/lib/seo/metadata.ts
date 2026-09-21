import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

const defaultOgImage = "/brand/icon-512.png";

function absoluteUrl(path: string): string {
  const base = siteConfig.url.replace(/\/$/, "");
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildNoIndexMetadata(options: {
  title: string;
  description: string;
}): Metadata {
  return buildPageMetadata({ ...options, noIndex: true });
}

export function buildPageMetadata(options: {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}): Metadata {
  const url = options.path ? absoluteUrl(options.path) : siteConfig.url;
  const ogImage = absoluteUrl(options.ogImage ?? defaultOgImage);

  return {
    title: options.title,
    description: options.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: siteConfig.name,
      title: options.title,
      description: options.description,
      images: [{ url: ogImage, width: 512, height: 512, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: options.title,
      description: options.description,
      images: [ogImage],
    },
    robots: options.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function buildSiteMetadata(): Metadata {
  return {
    ...buildPageMetadata({
      title: siteConfig.title,
      description: siteConfig.description,
      path: "/",
    }),
    title: {
      default: `${siteConfig.name} | Botanical Hair Care & Wellness`,
      template: `%s | ${siteConfig.name}`,
    },
    metadataBase: new URL(siteConfig.url),
    applicationName: siteConfig.name,
    category: "shopping",
    icons: {
      icon: [
        { url: "/brand/icon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/brand/icon-180.png", sizes: "180x180", type: "image/png" }],
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}
