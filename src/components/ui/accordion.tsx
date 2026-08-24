"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-magali-cream-100">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left font-medium text-magali-green-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magali-gold-600"
        aria-expanded={open}
      >
        {title}
        <ChevronDown
          className={cn(
            "h-5 w-5 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && <div className="pb-4 text-magali-ink/80">{children}</div>}
    </div>
  );
}
