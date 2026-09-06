"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { PageContainer } from "@/components/layout/page-container";
import { SearchDialog } from "@/components/shop/search-dialog";
import { IconButton } from "@/components/ui/icon-button";
import { primaryNavLinks, productSlugToCollection } from "@/config/site";
import { useBodyScrollLock, useCartBump, useFocusTrap } from "@/hooks/use-cart-ui";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

function isNavLinkActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/shop") {
    return (
      pathname === "/shop" ||
      pathname.startsWith("/products/") ||
      pathname.startsWith("/collections/")
    );
  }
  if (href.startsWith("/collections/")) {
    if (pathname === href || pathname.startsWith(`${href}/`)) return true;
    const productMatch = pathname.match(/^\/products\/([^/]+)/);
    if (productMatch) {
      return productSlugToCollection[productMatch[1]] === href.replace("/collections/", "");
    }
    return false;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

const navLinkClass = (isActive: boolean) =>
  cn(
    "eyebrow relative cursor-pointer pb-1 transition-colors duration-150 hover:text-botanical",
    isActive
      ? "text-ink after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-botanical"
      : "text-muted",
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

  const mobileNavLinks = [{ href: "/", label: "Home" }, ...primaryNavLinks];

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
            <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
              {primaryNavLinks.map((link) => {
                const isActive = isNavLinkActive(link.href, pathname);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={navLinkClass(isActive)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
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
              {mobileNavLinks.map((link) => {
                const isActive = isNavLinkActive(link.href, pathname);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "eyebrow cursor-pointer border-l-2 pl-3 transition-colors hover:text-botanical",
                      isActive
                        ? "border-botanical text-ink"
                        : "border-transparent text-muted",
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
