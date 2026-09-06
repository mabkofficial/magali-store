import { mainNav, settingsNav } from "@/lib/admin/nav-config";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type PageMeta = {
  title: string;
  breadcrumbs: BreadcrumbItem[];
};

const detailLabels: Record<string, string> = {
  products: "Product",
  orders: "Order",
  subscribers: "Newsletter",
};

const settingsLabels: Record<string, string> = {
  general: "General",
  shipping: "Shipping",
  seo: "SEO defaults",
  notifications: "Notifications",
  export: "Export",
};

export function getPageMeta(pathname: string): PageMeta {
  const path = pathname.replace(/\/$/, "") || "/admin";
  const segments = path.split("/").filter(Boolean);

  if (path === "/admin") {
    return {
      title: "Overview",
      breadcrumbs: [{ label: "Overview" }],
    };
  }

  if (path === "/admin/settings") {
    return {
      title: "Settings",
      breadcrumbs: [
        { label: "Overview", href: "/admin" },
        { label: "Settings" },
      ],
    };
  }

  const settingsItem = settingsNav.find(
    (item) => path === item.href || path.startsWith(`${item.href}/`),
  );

  if (settingsItem || path.startsWith("/admin/settings/")) {
    const section = segments[2] ?? "general";
    const label = settingsLabels[section] ?? "Settings";
    return {
      title: label,
      breadcrumbs: [
        { label: "Overview", href: "/admin" },
        { label: "Settings", href: "/admin/settings" },
        { label: label },
      ],
    };
  }

  const navItem = mainNav.find((item) => {
    if (item.href === "/admin") return false;
    return path === item.href || path.startsWith(`${item.href}/`);
  });

  const breadcrumbs: BreadcrumbItem[] = [{ label: "Overview", href: "/admin" }];

  if (navItem) {
    breadcrumbs.push(
      path === navItem.href
        ? { label: navItem.title }
        : { label: navItem.title, href: navItem.href },
    );

    const section = segments[1];
    const id = segments[2];
    if (id && section) {
      const detailLabel =
        id === "new" ? "New product" : (detailLabels[section] ?? "Detail");
      breadcrumbs.push({ label: detailLabel });
      return {
        title: detailLabel,
        breadcrumbs,
      };
    }

    return { title: navItem.title, breadcrumbs };
  }

  const fallback = segments[1] ?? "Admin";
  breadcrumbs.push({ label: fallback.charAt(0).toUpperCase() + fallback.slice(1) });
  return { title: fallback, breadcrumbs };
}
