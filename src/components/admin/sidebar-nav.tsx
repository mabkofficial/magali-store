"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronRight, Settings } from "lucide-react";
import { Badge } from "@/components/ui/cms-badge";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  isNavActive,
  mainNav,
  secondaryNav,
  settingsNav,
  type SidebarCounts,
} from "@/lib/admin/nav-config";
import { cn } from "@/lib/utils";
import { sidebarGroupIconModeClass } from "@/components/admin/sidebar-shell-classes";

function NavBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <Badge
      variant="secondary"
      className="ml-auto h-5 min-w-5 justify-center rounded-full px-2 text-[10px] tabular-nums group-data-[collapsible=icon]:hidden"
    >
      {count > 99 ? "99+" : count}
    </Badge>
  );
}

export function SidebarNav({ counts }: { counts: SidebarCounts }) {
  const pathname = usePathname();
  const settingsActive = pathname.startsWith("/admin/settings");
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const settingsOpen = settingsActive || settingsExpanded;

  return (
    <>
      <SidebarGroup className={cn("px-3 py-2", sidebarGroupIconModeClass)}>
        <SidebarGroupLabel className="text-[11px]">Store</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {mainNav.map((item) => {
              const active = isNavActive(pathname, item.href);
              const badgeCount =
                item.badgeKey === "pendingOrders" ? counts.pendingOrders : 0;

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    tooltip={item.title}
                    isActive={active}
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                    <NavBadge count={badgeCount} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup className={cn("px-3 py-2", sidebarGroupIconModeClass)}>
        <SidebarGroupLabel className="text-[11px]">Configure</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Settings"
                isActive={settingsActive}
                onClick={() => setSettingsExpanded((open) => !open)}
              >
                <Settings className="size-4" />
                <span>Settings</span>
                <ChevronRight
                  className={cn(
                    "ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[collapsible=icon]:hidden",
                    settingsOpen && "rotate-90",
                  )}
                />
              </SidebarMenuButton>
              {settingsOpen && (
                <SidebarMenuSub>
                  {settingsNav.map((item) => (
                    <SidebarMenuSubItem key={item.href}>
                      <SidebarMenuSubButton
                        render={<Link href={item.href} />}
                        isActive={isNavActive(pathname, item.href)}
                      >
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup
        className={cn("mt-auto px-3 py-2", sidebarGroupIconModeClass)}
      >
        <SidebarGroupLabel className="text-[11px]">Links</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {secondaryNav.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  render={
                    <Link
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                    />
                  }
                  tooltip={item.title}
                >
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
