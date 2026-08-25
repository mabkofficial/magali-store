import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const brandAssets = {
  logo: "/brand/magali-logo.png",
  wordmark: "/brand/magali-wordmark.png",
  mark: "/brand/magali-mark.png",
  lockup: "/brand/magali-lockup.png",
} as const;

type BrandVariant = keyof typeof brandAssets;

interface BrandLogoProps {
  variant?: BrandVariant;
  href?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

const variantSizes: Record<
  BrandVariant,
  { width: number; height: number; className: string }
> = {
  logo: {
    width: 443,
    height: 126,
    className: "h-6 w-auto sm:h-7",
  },
  wordmark: {
    width: 216,
    height: 126,
    className: "h-6 w-auto sm:h-7",
  },
  mark: {
    width: 213,
    height: 125,
    className: "h-7 w-auto sm:h-8",
  },
  lockup: {
    width: 383,
    height: 323,
    className: "h-16 w-auto",
  },
};

export function BrandLogo({
  variant = "logo",
  href = "/",
  className,
  imageClassName,
  priority = false,
}: BrandLogoProps) {
  const asset = brandAssets[variant];
  const size = variantSizes[variant];

  const image = (
    <Image
      src={asset}
      alt="Magali"
      width={size.width}
      height={size.height}
      priority={priority}
      className={cn(size.className, imageClassName)}
    />
  );

  if (!href) {
    return <span className={cn("inline-flex shrink-0", className)}>{image}</span>;
  }

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex shrink-0 transition-opacity duration-150 hover:opacity-70",
        className,
      )}
      aria-label="Magali home"
    >
      {image}
    </Link>
  );
}

export { brandAssets };
