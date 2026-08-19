"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/** Signal hairline across the top of the viewport tracking read progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  // The spring adds motion of its own, so track scroll position directly when
  // the visitor has asked for less of it — the bar still works, it just does
  // not overshoot or settle.
  const scaleX = reduce ? scrollYProgress : smoothed;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-signal"
    />
  );
}
