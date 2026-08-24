"use client";

import { useRouter, useSearchParams } from "next/navigation";
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
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => setCategory(category)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            active === category
              ? "bg-magali-green-950 text-white"
              : "bg-magali-cream-100 text-magali-green-950 hover:bg-magali-cream-100/80",
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
    <select
      value={sort}
      onChange={handleChange}
      className="rounded-xl border border-magali-cream-100 bg-white px-4 py-2 text-sm"
      aria-label="Sort products"
    >
      <option value="featured">Featured</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="name">Name</option>
    </select>
  );
}
