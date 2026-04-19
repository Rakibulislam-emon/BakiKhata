"use client";

import { LazyMotion, domAnimation } from "@/lib/framer";
import { ReactNode } from "react";

export function AnimationProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
