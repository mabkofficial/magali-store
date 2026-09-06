import Link from "next/link";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/cms-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const exports = [
  {
    title: "Products",
    description: "Full product catalog with pricing and inventory.",
    href: "/api/admin/export/products",
  },
  {
    title: "Orders",
    description: "Paid orders with customer email and totals.",
    href: "/api/admin/export/orders",
  },
  {
    title: "Newsletter subscribers",
    description: "All newsletter signups.",
    href: "/api/admin/export/subscribers",
  },
];

export default function ExportSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Export</h2>
        <p className="text-sm text-muted-foreground">
          Download CSV snapshots for backup or analysis.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {exports.map((item) => (
          <Card key={item.href}>
            <CardHeader>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button render={<Link href={item.href} download />}>
                <Download className="size-4" />
                Download CSV
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
