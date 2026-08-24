"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goTo = (index: number) => {
    setSelected((index + images.length) % images.length);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      goTo(selected + (delta < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  };

  return (
    <div>
      <div
        className="relative aspect-square overflow-hidden bg-surface-muted"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[selected]}
          alt={`${productName}, image ${selected + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-contain p-8 lg:p-12"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(selected - 1)}
              className="pressable absolute left-3 top-1/2 -translate-y-1/2 border border-border bg-surface p-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink lg:hidden"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => goTo(selected + 1)}
              className="pressable absolute right-3 top-1/2 -translate-y-1/2 border border-border bg-surface p-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink lg:hidden"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelected(index)}
              className={cn(
                "relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden border bg-surface-muted transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink",
                selected === index ? "border-ink" : "border-border hover:border-ink/40",
              )}
              aria-label={`View image ${index + 1}`}
              aria-current={selected === index ? "true" : undefined}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
