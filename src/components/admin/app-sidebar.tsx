"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/admin/nav-user";
import { SidebarNav } from "@/components/admin/sidebar-nav";
import type { AdminContext } from "@/lib/admin/auth";
import type { SidebarCounts } from "@/lib/admin/nav-config";
import { cn } from "@/lib/utils";
import {
  sidebarCollapsedButtonClass,
  sidebarHeaderFooterIconModeClass,
} from "@/components/admin/sidebar-shell-classes";

export function AppSidebar({
  admin,
  counts,
}: {
  admin: AdminContext;
  counts: SidebarCounts;
}) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader
        className={cn(
          "flex h-(--header-height) shrink-0 flex-row items-center gap-0 border-b border-sidebar-border px-3 py-0",
          sidebarHeaderFooterIconModeClass,
        )}
      >
        <SidebarMenu className="group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/admin" />}
              tooltip="Magali Admin"
              isActive={pathname === "/admin"}
              className={cn(sidebarCollapsedButtonClass, "h-9")}
            >
              <Image
                src="/brand/magali-mark.png"
                alt="Magali"
                width={32}
                height={32}
                className="size-8 shrink-0 object-contain"
              />
              <div className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm font-medium">Magali</span>
                <span className="truncate text-[11px] text-muted-foreground">
                  Store admin
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <SidebarNav counts={counts} />
      </SidebarContent>

      <SidebarFooter
        className={cn(
          "gap-1 border-t border-sidebar-border px-3 py-2",
          sidebarHeaderFooterIconModeClass,
        )}
      >
        <NavUser admin={admin} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
