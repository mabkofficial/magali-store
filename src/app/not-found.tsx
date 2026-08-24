import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center lg:px-8">
      <p className="text-sm font-medium uppercase tracking-widest text-magali-gold-600">
        404
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold text-magali-green-950">
        Page Not Found
      </h1>
      <p className="mt-4 text-magali-ink/60">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link href="/shop" className="mt-8 inline-block">
        <Button>Shop All Products</Button>
      </Link>
    </div>
  );
}
