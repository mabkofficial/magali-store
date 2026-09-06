"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ThemeToggle } from "@/components/admin/theme-toggle";
import { getPageMeta } from "@/lib/admin/page-meta";

export function SiteHeader() {
  const pathname = usePathname();
  const { title, breadcrumbs } = getPageMeta(pathname);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 md:rounded-t-xl">
      <div className="flex w-full min-w-0 items-center gap-2 px-4 lg:px-5">
        <SidebarTrigger className="-ml-0.5 shrink-0" />
        <Separator orientation="vertical" className="hidden h-5 !self-center sm:block" />

        <div className="flex min-w-0 flex-1 items-center">
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList className="text-sm leading-none">
              {breadcrumbs.map((crumb, i) => {
                const isLast = i === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={`${crumb.label}-${i}`}>
                    {i > 0 && (
                      <BreadcrumbSeparator className="text-muted-foreground/50" />
                    )}
                    <BreadcrumbItem>
                      {isLast || !crumb.href ? (
                        <BreadcrumbPage className="max-w-[12rem] truncate font-medium leading-none">
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          render={<Link href={crumb.href} />}
                          className="max-w-[8rem] truncate leading-none"
                        >
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="truncate text-sm font-semibold leading-none tracking-tight sm:hidden">
            {title}
          </h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
