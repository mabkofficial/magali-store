"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
  productId?: string;
  bundleId?: string;
  className?: string;
  compact?: boolean;
};

export function WishlistButton({
  productId,
  bundleId,
  className,
  compact = false,
}: Props) {
  const pathname = usePathname();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState<boolean | null>(null);

  const loginHref = `/account/login?next=${encodeURIComponent(pathname)}`;

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/account/wishlist");
      if (res.status === 401) {
        setAuthed(false);
        setSaved(false);
        return;
      }
      setAuthed(true);
      const data = (await res.json()) as {
        items: { kind: string; productId?: string; bundleId?: string }[];
      };
      const match = data.items.some((item) =>
        productId
          ? item.kind === "product" && item.productId === productId
          : item.kind === "bundle" && item.bundleId === bundleId,
      );
      setSaved(match);
    } catch {
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  }, [productId, bundleId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const toggle = async () => {
    if (authed === false) {
      toast.info("Sign in to save items to your wishlist.");
      return;
    }
    const body = productId ? { productId } : { bundleId };
    const method = saved ? "DELETE" : "POST";
    const res = await fetch("/api/account/wishlist", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status === 401) {
      toast.info("Sign in to save items to your wishlist.");
      return;
    }
    if (!res.ok) {
      toast.error("Could not update wishlist.");
      return;
    }
    setSaved(!saved);
    toast.success(saved ? "Removed from wishlist" : "Saved to wishlist");
  };

  if (authed === false) {
    return (
      <Link
        href={loginHref}
        className={cn(
          "inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-botanical",
          className,
        )}
        aria-label="Sign in to save to wishlist"
      >
        <Heart className="h-4 w-4" strokeWidth={1.5} />
        {!compact && <span>Save</span>}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      disabled={loading}
      className={cn(
        "inline-flex items-center gap-2 text-sm transition-colors hover:text-botanical",
        saved ? "text-botanical" : "text-muted",
        className,
      )}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={saved}
    >
      <Heart
        className="h-4 w-4"
        strokeWidth={1.5}
        fill={saved ? "currentColor" : "none"}
      />
      {!compact && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}
