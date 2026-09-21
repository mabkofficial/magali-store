"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
export function WishlistHeaderLink({ overlay = false }: { overlay?: boolean }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/account/wishlist");
        if (res.status === 401) {
          setVisible(false);
          return;
        }
        setVisible(true);
        const data = (await res.json()) as { count: number };
        setCount(data.count ?? 0);
      } catch {
        setVisible(false);
      }
    })();
  }, []);

  if (!visible) return null;

  return (
    <div className="relative">
      <Link
        href="/account/wishlist"
        aria-label="Wishlist"
        className={cn(
          "pressable relative inline-flex min-h-11 min-w-11 items-center justify-center transition-colors duration-150",
          overlay
            ? "text-surface hover:bg-surface/10"
            : "text-ink hover:bg-surface-muted",
        )}
      >
        <Heart className="h-5 w-5" strokeWidth={1.5} />
      </Link>
      {count > 0 && (
        <span className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center bg-ink px-1 text-[10px] font-medium text-surface">
          {count}
        </span>
      )}
    </div>
  );
}
