"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-sm">
        <Image
          src={images[selected]}
          alt={`${productName} — image ${selected + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-contain p-6"
        />
      </div>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setSelected(index)}
            className={cn(
              "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-colors",
              selected === index
                ? "border-magali-gold-600"
                : "border-transparent hover:border-magali-cream-100",
            )}
            aria-label={`View image ${index + 1}`}
          >
            <Image
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              fill
              sizes="80px"
              className="object-contain p-1"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
