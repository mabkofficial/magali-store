"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        classNames: {
          toast: "border border-border bg-surface text-ink text-sm",
        },
      }}
    />
  );
}
