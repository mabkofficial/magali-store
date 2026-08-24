import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center lg:px-8">
      <p className="eyebrow text-muted">404</p>
      <h1 className="mt-4 font-display text-4xl text-ink">Page not found</h1>
      <p className="mt-4 text-sm text-muted">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link href="/shop" className="mt-10 inline-block">
        <Button>Shop Collection</Button>
      </Link>
    </div>
  );
}
