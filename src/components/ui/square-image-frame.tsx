import Image from "next/image";
import { cn } from "@/lib/utils";

interface SquareImageFrameProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  padding?: "sm" | "md" | "lg" | "none";
  className?: string;
  imageClassName?: string;
}

const paddingMap = {
  none: "p-0",
  sm: "p-4 sm:p-6",
  md: "p-6 sm:p-8 lg:p-10",
  lg: "p-8 sm:p-10 lg:p-14",
};

export function SquareImageFrame({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  padding = "md",
  className,
  imageClassName,
}: SquareImageFrameProps) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full min-w-0 overflow-hidden bg-surface-muted",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-contain", paddingMap[padding], imageClassName)}
      />
    </div>
  );
}
