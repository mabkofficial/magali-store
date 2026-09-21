import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

const disallowPaths = [
  "/admin/",
  "/account/",
  "/order/",
  "/api/",
  "/cart",
  "/admin",
];

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowPaths,
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/admin/", "/account/", "/order/", "/api/", "/cart"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/admin/", "/account/", "/order/", "/api/", "/cart"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/admin/", "/account/", "/order/", "/api/", "/cart"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/admin/", "/account/", "/order/", "/api/", "/cart"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/admin/", "/account/", "/order/", "/api/", "/cart"],
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: ["/admin/", "/account/", "/order/", "/api/", "/cart"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
