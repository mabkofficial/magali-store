"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const categories = ["All", "Hair Care", "Wellness", "Food"] as const;

export function CategoryChips() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "All";

  const setCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-6" role="group" aria-label="Filter by category">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => setCategory(category)}
          aria-pressed={active === category}
          className={cn(
            "eyebrow cursor-pointer transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink",
            active === category ? "text-ink" : "text-muted hover:text-ink",
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "featured";

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", event.target.value);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <Select
      value={sort}
      onChange={handleChange}
      aria-label="Sort products"
      className="w-auto min-w-[160px] border-0 border-b border-border px-0 py-1"
    >
      <option value="featured">Featured</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="name">Name</option>
    </Select>
  );
}
