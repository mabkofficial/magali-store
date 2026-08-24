"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navLinks, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-magali-cream-100 bg-magali-cream-50/90 backdrop-blur-md"
          : "bg-magali-cream-50",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <button
          type="button"
          className="rounded-lg p-2 lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6 text-magali-green-950" />
        </button>

        <Link
          href="/"
          className="font-display text-2xl font-semibold tracking-wide text-magali-green-950 lg:text-3xl"
        >
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-magali-gold-600",
                pathname === link.href
                  ? "text-magali-gold-600"
                  : "text-magali-green-950",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/shop"
            className="rounded-lg p-2 hover:bg-magali-cream-100"
            aria-label="Search products"
          >
            <Search className="h-5 w-5 text-magali-green-950" />
          </Link>
          <Link
            href="/cart"
            className="relative rounded-lg p-2 hover:bg-magali-cream-100"
            aria-label={`Cart with ${itemCount} items`}
          >
            <ShoppingBag className="h-5 w-5 text-magali-green-950" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-magali-gold-600 text-xs font-medium text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu overlay"
          />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-magali-cream-50 p-6 shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-xl font-semibold text-magali-green-950">
                {siteConfig.name}
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-4" aria-label="Mobile">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-medium text-magali-green-950"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
