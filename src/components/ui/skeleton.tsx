import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton bg-surface-muted", className)}
      {...props}
    />
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-4">
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}
