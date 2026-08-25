"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { PageContainer } from "@/components/layout/page-container";
import { SearchDialog } from "@/components/shop/search-dialog";
import { IconButton } from "@/components/ui/icon-button";
import { navLinks } from "@/config/site";
import { useBodyScrollLock, useCartBump, useFocusTrap } from "@/hooks/use-cart-ui";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

const desktopNav = navLinks.filter((link) =>
  ["/shop", "/about"].includes(link.href),
);

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const bumpKey = useCartStore((state) => state.bumpKey);
  const openCart = useCartStore((state) => state.openCart);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const bumpRef = useCartBump(bumpKey);

  useFocusTrap(mobileOpen, mobilePanelRef);
  useBodyScrollLock(mobileOpen);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-surface">
        <PageContainer className="relative flex h-16 items-center justify-between sm:h-[4.5rem]">
          <div className="flex min-w-0 items-center gap-1 sm:gap-4">
            <IconButton
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </IconButton>
            <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
              {desktopNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "eyebrow cursor-pointer transition-opacity duration-150 hover:opacity-60",
                    pathname === link.href ? "text-ink" : "text-muted",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <BrandLogo
            variant="logo"
            className="absolute left-1/2 -translate-x-1/2"
            priority
          />

          <div className="flex shrink-0 items-center">
            <IconButton
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </IconButton>
            <div className="relative">
              <IconButton onClick={openCart} aria-label={`Open cart, ${itemCount} items`}>
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              </IconButton>
              {itemCount > 0 && (
                <span
                  ref={bumpRef}
                  className="cart-bump pointer-events-none absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center bg-ink px-1 text-[10px] font-medium text-surface"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {itemCount}
                </span>
              )}
            </div>
          </div>
        </PageContainer>
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="drawer-overlay absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu overlay"
          />
          <div
            ref={mobilePanelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="drawer-panel-left absolute left-0 top-0 flex h-full w-80 max-w-[85vw] flex-col border-r border-border bg-surface p-8"
          >
            <div className="mb-12 flex items-center justify-between">
              <BrandLogo variant="logo" className="hover:opacity-100" />
              <IconButton onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </IconButton>
            </div>
            <nav className="flex flex-col gap-6" aria-label="Mobile">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="eyebrow cursor-pointer text-ink"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
