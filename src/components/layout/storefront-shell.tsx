"use client";

import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MiniCartDrawer } from "@/components/cart/mini-cart-drawer";
import { AccountAuthFrame } from "@/components/account/account-auth-frame";
import { isAccountAuthPath } from "@/lib/customer/redirect";

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  if (isAccountAuthPath(pathname)) {
    return <AccountAuthFrame>{children}</AccountAuthFrame>;
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <MiniCartDrawer />
    </>
  );
}
