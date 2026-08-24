"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        classNames: {
          toast: "rounded-xl border border-magali-cream-100 bg-white text-magali-ink shadow-lg",
        },
      }}
    />
  );
}
