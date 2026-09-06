import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Download,
  ExternalLink,
  LayoutDashboard,
  Mail,
  Package,
  ShoppingBag,
  Ship,
  Sparkles,
  Store,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  badgeKey?: "pendingOrders";
};

export const mainNav: NavItem[] = [
  { title: "Overview", href: "/admin", icon: LayoutDashboard },
  { title: "Products", href: "/admin/products", icon: Package },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
    badgeKey: "pendingOrders",
  },
  { title: "Newsletter", href: "/admin/subscribers", icon: Mail },
];

export const settingsNav: NavItem[] = [
  { title: "General", href: "/admin/settings/general", icon: Store },
  { title: "Shipping", href: "/admin/settings/shipping", icon: Ship },
  { title: "SEO defaults", href: "/admin/settings/seo", icon: Sparkles },
  { title: "Notifications", href: "/admin/settings/notifications", icon: Bell },
  { title: "Export", href: "/admin/settings/export", icon: Download },
];

export const secondaryNav = [
  { title: "View store", href: "/", icon: ExternalLink, external: true },
];

export type SidebarCounts = {
  pendingOrders: number;
};

export function isNavActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
