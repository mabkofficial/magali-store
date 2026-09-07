import { siteConfig } from "@/config/site";

export function AnnouncementBar() {
  return (
    <div className="border-b border-border bg-ink px-4 py-2 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-surface">
      {siteConfig.announcement}
    </div>
  );
}
