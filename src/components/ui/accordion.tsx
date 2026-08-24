"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

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
  const panelId = useId();

  return (
    <div className="border-b border-border">
      <button
        type="button"
        id={`${panelId}-trigger`}
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center justify-between py-5 text-left text-sm text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink"
        aria-expanded={open}
        aria-controls={`${panelId}-panel`}
      >
        <span className="uppercase tracking-[0.08em]">{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            open && "rotate-180",
          )}
          strokeWidth={1.5}
        />
      </button>
      <div
        id={`${panelId}-panel`}
        role="region"
        aria-labelledby={`${panelId}-trigger`}
        hidden={!open}
        className="pb-5 text-sm leading-relaxed text-muted"
      >
        {children}
      </div>
    </div>
  );
}
