"use client";

import Image from "next/image";
import { Label } from "@/components/ui/label";
import { getPrimaryImageUrl } from "@/lib/products/images";
import type { ProductImage } from "@/types/product";

export type FbtProductOption = {
  id: string;
  name: string;
  short_name: string;
  images: ProductImage[];
  is_active: boolean;
};

interface FbtProductPickerProps {
  productId?: string;
  options: FbtProductOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function FbtProductPicker({
  productId,
  options,
  selectedIds,
  onChange,
}: FbtProductPickerProps) {
  const available = options.filter((option) => option.id !== productId);

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((current) => current !== id));
      return;
    }
    onChange([...selectedIds, id]);
  };

  const move = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= selectedIds.length) return;

    const next = [...selectedIds];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onChange(next);
  };

  if (available.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Add more products to configure frequently bought together pairs.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Frequently bought together</Label>
        <p className="mt-1 text-xs text-muted-foreground">
          Select products shown as bundle companions on the product page. Order
          controls display priority.
        </p>
      </div>

      <div className="space-y-2">
        {available.map((option) => {
          const checked = selectedIds.includes(option.id);
          return (
            <label
              key={option.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-muted/40"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(option.id)}
                className="h-4 w-4 accent-foreground"
              />
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-muted">
                <Image
                  src={getPrimaryImageUrl(option.images)}
                  alt={option.name}
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{option.short_name}</p>
                <p className="truncate text-xs text-muted-foreground">{option.name}</p>
              </div>
              {!option.is_active && (
                <span className="text-xs text-muted-foreground">Inactive</span>
              )}
            </label>
          );
        })}
      </div>

      {selectedIds.length > 0 && (
        <div className="rounded-lg border p-3">
          <p className="text-xs font-medium text-muted-foreground">Display order</p>
          <ol className="mt-2 space-y-2">
            {selectedIds.map((id, index) => {
              const option = options.find((item) => item.id === id);
              if (!option) return null;

              return (
                <li
                  key={id}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span>
                    {index + 1}. {option.short_name}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="rounded border px-2 py-0.5 text-xs hover:bg-muted"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="rounded border px-2 py-0.5 text-xs hover:bg-muted"
                      onClick={() => move(index, 1)}
                      disabled={index === selectedIds.length - 1}
                    >
                      ↓
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
