"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * `prefers-reduced-motion` is only neutralised for CSS animations in
 * globals.css — framer-motion runs its transforms in JS and ignores the media
 * query unless it is told to respect it. `reducedMotion="user"` makes every
 * motion component drop transform and layout animation for those visitors while
 * keeping opacity fades, so entrances still read as entrances.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
