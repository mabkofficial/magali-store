import type { Metadata } from "next";
import { buildNoIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildNoIndexMetadata({
  title: "Account",
  description: "Sign in or create a Magali account.",
});

export default function AccountAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
