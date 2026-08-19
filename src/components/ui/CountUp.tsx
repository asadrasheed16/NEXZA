"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type Props = {
  to: number;
  suffix?: string;
  duration?: number;
  /** Decimal places to hold, so a figure like 2.1x counts up honestly. */
  decimals?: number;
  className?: string;
};

/**
 * Counts from 0 to `to` the first time it scrolls into view.
 * Uses rAF rather than a motion value so the DOM text stays selectable.
 */
export function CountUp({
  to,
  suffix = "",
  duration = 1.8,
  decimals = 0,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;

    let raf = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const t = Math.min((now - start) / (duration * 1000), 1);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(eased * to);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduce]);

  const shown = (reduce ? to : value).toFixed(decimals);

  return (
    <span ref={ref} className={className}>
      {shown}
      {suffix}
    </span>
  );
}
