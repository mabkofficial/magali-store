import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { AdminThemeProvider } from "@/components/admin/admin-theme-provider";
import { AdminToaster } from "@/components/admin/admin-toaster";
import { SiteHeader } from "@/components/admin/site-header";
import { getAdminContext } from "@/lib/admin/auth";
import { getAdminClient } from "@/lib/supabase/admin";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Geist, Geist_Mono } from "next/font/google";
import "../admin-globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

async function getSidebarCounts() {
  const admin = getAdminClient();
  if (!admin) return { pendingOrders: 0 };

  const { count } = await admin
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "paid");

  return { pendingOrders: count ?? 0 };
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminContext();
  if (!admin) {
    redirect("/admin/login");
  }

  const counts = await getSidebarCounts();

  return (
    <AdminThemeProvider>
      <div className={`admin-app min-h-screen ${geistSans.variable} ${geistMono.variable} font-sans`}>
        <AdminToaster />
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 64)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar admin={admin} counts={counts} />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">{children}</div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </AdminThemeProvider>
  );
}
