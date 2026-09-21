"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MiniCartDrawer } from "@/components/cart/mini-cart-drawer";
import { AccountAuthFrame } from "@/components/account/account-auth-frame";
import { isAccountAuthPath } from "@/lib/customer/redirect";
import { cn } from "@/lib/utils";

const SCROLL_SOLID_THRESHOLD = 16;

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }

    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_SOLID_THRESHOLD);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  if (isAdmin) {
    return <>{children}</>;
  }

  if (isAccountAuthPath(pathname)) {
    return <AccountAuthFrame>{children}</AccountAuthFrame>;
  }

  const heroNav = isHome && !scrolled;

  return (
    <>
      <div
        className={cn(
          "z-40 w-full",
          isHome ? "fixed inset-x-0 top-0" : "sticky top-0",
        )}
      >
        <AnnouncementBar overlay={heroNav} />
        <Header overlay={heroNav} />
      </div>
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <MiniCartDrawer />
    </>
  );
}
