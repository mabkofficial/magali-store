import Link from "next/link";
import { SectionShell } from "@/components/layout/section-shell";
import { Button } from "@/components/ui/button";

export function StorySection() {
  return (
    <SectionShell muted>
      <div className="grid min-w-0 grid-gap lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="font-display text-3xl text-ink lg:text-4xl">
            Botanical care, everyday rituals
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
            Magali is hair care you keep on the shelf, wellness oils within
            reach, and Caribbean food ready when you are — same standard of
            ingredients whether it is wash day or dinner.
          </p>
        </div>
        <div className="flex flex-col justify-end gap-3 lg:col-span-5 lg:items-end">
          <Link href="/about">
            <Button variant="outline">About Magali</Button>
          </Link>
          <Link href="/contact">
            <Button variant="ghost">Contact us</Button>
          </Link>
        </div>
      </div>
    </SectionShell>
  );
}
