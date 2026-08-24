import { Leaf, Lock, ShieldCheck, Truck } from "lucide-react";

const badges = [
  {
    icon: Leaf,
    label: "Botanical ingredients",
    description: "Rooted in nature",
  },
  {
    icon: ShieldCheck,
    label: "Quality formulas",
    description: "Thoughtfully prepared",
  },
  {
    icon: Lock,
    label: "Secure checkout",
    description: "Powered by Stripe",
  },
  {
    icon: Truck,
    label: "Shipping info",
    description: "Calculated at checkout",
  },
] as const;

export function TrustBadges({ variant = "light" }: { variant?: "light" | "dark" }) {
  const isDark = variant === "dark";

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {badges.map(({ icon: Icon, label, description }) => (
        <li
          key={label}
          className="flex flex-col items-center text-center sm:items-start sm:text-left"
        >
          <div
            className={
              isDark
                ? "mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-magali-green-800 text-magali-gold-500"
                : "mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-magali-cream-100 text-magali-green-800"
            }
          >
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          <p
            className={
              isDark
                ? "text-sm font-medium text-magali-cream-50"
                : "text-sm font-medium text-magali-green-950"
            }
          >
            {label}
          </p>
          <p
            className={
              isDark
                ? "mt-1 text-xs text-magali-cream-50/70"
                : "mt-1 text-xs text-magali-ink/60"
            }
          >
            {description}
          </p>
        </li>
      ))}
    </ul>
  );
}
