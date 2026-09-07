import { OrderStatusBadge } from "@/components/admin/status-badge";
import Link from "next/link";
import { ArrowUpRight, Package, ShoppingBag, Users } from "lucide-react";
import { Badge } from "@/components/ui/cms-badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/cms-button";
import { cn } from "@/lib/utils";

type StatCard = {
  label: string;
  value: number | string;
  href: string;
  description: string;
  footer: string;
  icon: React.ComponentType<{ className?: string }>;
};

export function DashboardStats({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="@container/card shadow-xs">
          <CardHeader>
            <CardDescription>{stat.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stat.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="gap-1">
                <stat.icon className="size-3.5" />
                Live
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">{stat.description}</div>
            <div className="flex w-full items-center justify-between gap-2">
              <span className="text-muted-foreground">{stat.footer}</span>
              <Link
                href={stat.href}
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-7 px-2")}
              >
                View
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export { OrderStatusBadge };

export const statIcons = {
  products: Package,
  orders: ShoppingBag,
  subscribers: Users,
};
