import Link from "next/link";
import {
  Bell,
  Download,
  Ship,
  Sparkles,
  Store,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const settingsCards = [
  {
    title: "General",
    description: "Store name, contact details, and social links.",
    href: "/admin/settings/general",
    icon: Store,
  },
  {
    title: "Shipping",
    description: "Standard and frozen shipping rates and regions.",
    href: "/admin/settings/shipping",
    icon: Ship,
  },
  {
    title: "SEO defaults",
    description: "Site-wide meta description and OG image fallbacks.",
    href: "/admin/settings/seo",
    icon: Sparkles,
  },
  {
    title: "Notifications",
    description: "Contact form and order email configuration.",
    href: "/admin/settings/notifications",
    icon: Bell,
  },
  {
    title: "Export",
    description: "Download products, orders, and subscribers as CSV.",
    href: "/admin/settings/export",
    icon: Download,
  },
];

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure store details, shipping, SEO, and exports.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {settingsCards.map((card) => (
          <Link key={card.href} href={card.href} className="block">
            <Card className="h-full transition-colors hover:bg-muted/40">
              <CardHeader>
                <card.icon className="mb-2 size-5 text-muted-foreground" />
                <CardTitle className="text-base">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
