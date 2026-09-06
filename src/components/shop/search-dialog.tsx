"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useBodyScrollLock, useFocusTrap } from "@/hooks/use-cart-ui";
import { formatUSD } from "@/lib/currency";

type SearchProduct = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: string;
  tagline: string;
  price: number;
};

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  if (!open) return null;
  return <SearchDialogPanel onClose={onClose} />;
}

function SearchDialogPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useFocusTrap(true, panelRef);
  useBodyScrollLock(true);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const normalized = query.trim().toLowerCase();
  const results = normalized
    ? products.filter((product) =>
        [product.name, product.shortName, product.category, product.tagline]
          .join(" ")
          .toLowerCase()
          .includes(normalized),
      )
    : [];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="drawer-overlay absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close search"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        className="absolute left-1/2 top-24 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 border border-border bg-surface p-6"
      >
        <form onSubmit={handleSubmit} className="flex items-center gap-3 border-b border-border pb-4">
          <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
            className="flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-muted-light"
            aria-label="Search products"
          />
          <button
            type="button"
            onClick={onClose}
            className="pressable p-1 hover:opacity-60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink"
            aria-label="Close search"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </form>

        {normalized && (
          <ul className="mt-4 max-h-64 overflow-y-auto">
            {results.length === 0 ? (
              <li className="py-4 text-sm text-muted">No products found.</li>
            ) : (
              results.map((product) => (
                <li key={product.id} className="border-b border-border last:border-0">
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between py-3 text-sm transition-opacity hover:opacity-60"
                  >
                    <span className="text-ink">{product.shortName}</span>
                    <span className="text-muted">{formatUSD(product.price)}</span>
                  </Link>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
