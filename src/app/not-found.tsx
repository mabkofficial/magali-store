import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PageContainer narrow pageY className="text-center">
      <p className="eyebrow text-muted">404</p>
      <h1 className="mt-4 font-display text-4xl text-ink">Page not found</h1>
      <p className="mt-4 text-sm text-muted">
        The page you are looking for does not exist or may have been moved.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/shop">
          <Button>Shop collection</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Go home</Button>
        </Link>
        <Link href="/contact">
          <Button variant="outline">Contact</Button>
        </Link>
      </div>
    </PageContainer>
  );
}
