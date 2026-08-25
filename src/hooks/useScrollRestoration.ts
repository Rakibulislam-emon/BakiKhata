"use client";

import { useEffect, useRef } from "react";

export function useScrollRestoration(key: string) {
  const hasRestored = useRef(false);

  useEffect(() => {
    if (hasRestored.current) return;
    hasRestored.current = true;

    const saved = sessionStorage.getItem(`scroll-${key}`);
    if (saved) {
      requestAnimationFrame(() => {
        window.scrollTo(0, parseInt(saved, 10));
        sessionStorage.removeItem(`scroll-${key}`);
      });
    }
  }, [key]);

  const saveScroll = () => {
    sessionStorage.setItem(`scroll-${key}`, String(window.scrollY));
  };

  return { saveScroll };
}
