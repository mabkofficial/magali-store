import Link from "next/link";
import { Button } from "@/components/ui/cms-button";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm text-muted-foreground">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        Admin page not found
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        This admin URL does not exist or you may not have access.
      </p>
      <div className="mt-6 flex gap-3">
        <Button render={<Link href="/admin" />}>Dashboard</Button>
        <Button variant="outline" render={<Link href="/" />}>
          Storefront
        </Button>
      </div>
    </div>
  );
}
