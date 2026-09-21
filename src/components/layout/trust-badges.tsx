import { Leaf, Lock, Truck } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";

const badges = [
  {
    icon: Leaf,
    label: "Botanical formulas",
    description: "Thoughtfully blended ingredients",
  },
  {
    icon: Lock,
    label: "Secure checkout",
    description: "Powered by Stripe",
  },
  {
    icon: Truck,
    label: "US shipping",
    description: "Rates calculated at checkout",
  },
] as const;

export function TrustBadges({
  variant = "light",
  compact = false,
}: {
  variant?: "light" | "dark" | "minimal";
  compact?: boolean;
}) {
  const isDark = variant === "dark";
  const isMinimal = variant === "minimal";

  return (
    <section
      className={
        compact
          ? "border-t border-border bg-surface-muted page-y"
          : isMinimal
            ? "border-b border-border bg-surface"
            : isDark
              ? "border-b border-border bg-botanical text-surface"
              : "border-b border-border bg-surface-muted"
      }
    >
      <PageContainer className={compact ? undefined : "page-y"}>
        <ul
          className={
            isMinimal
              ? "divide-y divide-border border-y border-border sm:grid sm:grid-cols-3 sm:divide-x sm:divide-y-0"
              : compact
                ? "grid grid-gap sm:grid-cols-3"
                : "grid grid-gap sm:grid-cols-3"
          }
        >
          {badges.map(({ icon: Icon, label, description }) => (
            <li
              key={label}
              className={
                isMinimal
                  ? "px-0 py-5 sm:px-6 sm:py-6"
                  : "flex flex-col items-center text-center sm:items-start sm:text-left"
              }
            >
              {!isMinimal && (
                <div
                  className={
                    isDark
                      ? "mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-surface/10 text-surface"
                      : "mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-surface text-botanical"
                  }
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
              )}
              <p
                className={
                  isDark
                    ? "text-sm font-medium text-surface"
                    : "text-sm font-medium text-ink"
                }
              >
                {label}
              </p>
              <p
                className={
                  isDark
                    ? "mt-1 text-xs text-surface/70"
                    : "mt-1 text-xs text-muted"
                }
              >
                {description}
              </p>
            </li>
          ))}
        </ul>
      </PageContainer>
    </section>
  );
}
