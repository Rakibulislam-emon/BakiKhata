"use client";

import { Toaster } from "sonner";

export function ClientToaster() {
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      expand={true}
      toastOptions={{
        style: {
          fontFamily: "'Noto Sans Bengali', sans-serif",
          borderRadius: "1rem", // rounded-2xl
          padding: "1rem",
        },
        className: "!shadow-xl !font-medium",
      }}
    />
  );
}
