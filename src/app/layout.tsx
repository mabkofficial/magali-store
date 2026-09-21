import { IBM_Plex_Sans, Newsreader } from "next/font/google";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { JsonLd } from "@/components/seo/json-ld";
import { StorefrontShell } from "@/components/layout/storefront-shell";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { ToastProvider } from "@/components/ui/toast-provider";
import {
  getOrganizationJsonLd,
  getWebSiteJsonLd,
} from "@/lib/seo/json-ld";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import "./globals.css";

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = buildSiteMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plex.variable} ${newsreader.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <JsonLd data={[getOrganizationJsonLd(), getWebSiteJsonLd()]} />
        <GoogleAnalytics />
        <SkipToContent />
        <StorefrontShell>{children}</StorefrontShell>
        <ToastProvider />
      </body>
    </html>
  );
}
