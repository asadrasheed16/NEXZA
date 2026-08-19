"use client";

import { motion, type Variants, type TargetAndTransition } from "framer-motion";
import { useMemo, type ReactNode, type ElementType } from "react";
import { fadeUp, transition, viewport } from "@/lib/motion";

type Props = {
  children: ReactNode;
  /** Override the entrance variants (defaults to fadeUp). */
  variants?: Variants;
  /** Seconds of delay before the entrance runs. */
  delay?: number;
  className?: string;
  /** Rendered element — use `li`, `section`, etc. when semantics matter. */
  as?: ElementType;
};

/**
 * Scroll-triggered entrance wrapper. Every section uses this instead of
 * hand-rolling `whileInView`, so timing stays consistent.
 */
export function Reveal({
  children,
  variants = fadeUp,
  delay = 0,
  className,
  as = "div",
}: Props) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  // A variant's own `transition` beats the component's `transition` prop, so a
  // delay has to be folded into the variant itself or it is silently dropped.
  const delayed = useMemo<Variants>(() => {
    if (!delay) return variants;
    const show = variants.show;
    if (typeof show !== "object" || show === null) return variants;
    const target = show as TargetAndTransition;
    return {
      ...variants,
      show: {
        ...target,
        transition: { ...transition, ...target.transition, delay },
      },
    };
  }, [variants, delay]);

  return (
    <MotionTag
      className={className}
      variants={delayed}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Parent that reveals its children in sequence. Children should be
 * `<Reveal>` (or any motion element using the same `hidden`/`show` names).
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: ElementType;
}) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </MotionTag>
  );
}
