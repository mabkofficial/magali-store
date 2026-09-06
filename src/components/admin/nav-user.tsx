"use client";

import Link from "next/link";
import { ChevronsUpDown, ExternalLink, LogOut } from "lucide-react";
import { signOut } from "@/app/admin/(auth)/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { AdminContext } from "@/lib/admin/auth";
import { cn } from "@/lib/utils";
import {
  sidebarCollapsedButtonClass,
  sidebarCollapsedGraphicClass,
  sidebarHideWhenIcon,
} from "@/components/admin/sidebar-shell-classes";

function initials(name: string, email: string) {
  const fromName = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  if (fromName) return fromName;
  return email.slice(0, 2).toUpperCase();
}

export function NavUser({ admin }: { admin: AdminContext }) {
  const { isMobile, state } = useSidebar();
  const fallback = initials(admin.displayName, admin.email);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="w-full outline-none"
            render={
              <SidebarMenuButton
                size="lg"
                className={cn(
                  sidebarCollapsedButtonClass,
                  "h-12 group-data-[collapsible=icon]:!h-8",
                  "data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground",
                )}
              />
            }
          >
            <Avatar className={cn("rounded-lg", sidebarCollapsedGraphicClass)}>
              <AvatarFallback className="rounded-lg bg-primary/10 text-xs font-semibold text-primary group-data-[collapsible=icon]:rounded-md">
                {fallback}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "grid min-w-0 flex-1 text-left leading-tight",
                sidebarHideWhenIcon,
              )}
            >
              <span className="truncate text-sm font-medium">
                {admin.displayName}
              </span>
              <span className="truncate text-[11px] text-muted-foreground">
                {admin.email}
              </span>
            </div>
            <ChevronsUpDown
              className={cn(
                "ml-auto size-4 shrink-0 text-muted-foreground",
                sidebarHideWhenIcon,
              )}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : state === "collapsed" ? "right" : "top"}
            align={state === "collapsed" ? "center" : "end"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-primary/10 text-xs font-medium text-primary">
                    {fallback}
                  </AvatarFallback>
                </Avatar>
                <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{admin.displayName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {admin.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/" target="_blank" className="flex w-full items-center gap-2">
                <ExternalLink />
                View storefront
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                void signOut();
              }}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
