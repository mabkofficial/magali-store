import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function AnnouncementBar({ overlay = false }: { overlay?: boolean }) {
  const message = siteConfig.announcement?.trim();
  if (!message) return null;

  return (
    <div
      className={cn(
        "border-b px-4 py-2 text-center text-[11px] font-medium uppercase tracking-[0.14em] transition-[background-color,border-color,color] duration-200",
        overlay
          ? "border-transparent bg-transparent text-surface/90"
          : "border-border bg-ink text-surface",
      )}
    >
      {message}
    </div>
  );
}
