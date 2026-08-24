import { siteConfig } from "@/config/site";

export function AnnouncementBar() {
  return (
    <div className="bg-magali-green-950 px-4 py-2 text-center text-sm text-magali-cream-50">
      {siteConfig.announcement}
    </div>
  );
}
