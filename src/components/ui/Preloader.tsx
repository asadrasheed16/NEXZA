"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { brand, site } from "@/config/site";
import { EASE } from "@/lib/motion";

/**
 * Same geometry as the mark in Logo.tsx — two peaks, five flat facets, the ice
 * shard last so it stays on top.
 */
const FACETS = [
  { points: "12,104 48,20 48,104", fill: brand.indigo },
  { points: "48,20 84,104 48,104", fill: brand.signal },
  { points: "58,104 82,52 82,104", fill: brand.signal },
  { points: "82,52 106,104 82,104", fill: brand.periwinkle },
  { points: "46,104 64,70 82,104", fill: brand.ice },
] as const;

/** Seconds the colour takes to fill the mark. */
const FILL_SECONDS = 1.4;

const VIEW_TOP = 20;
const VIEW_BOTTOM = 104;

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const reduce = useReducedMotion();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (reduce) {
      // no fill animation — the mark renders complete (see `shown` below) and
      // the overlay simply steps aside
      const t = setTimeout(() => setDone(true), 320);
      return () => clearTimeout(t);
    }

    let raf = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const t = Math.min((now - start) / (FILL_SECONDS * 1000), 1);
      setProgress(t);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDone(true);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  /* Hold the page still underneath while the overlay is up. Released on unmount
     so a visitor who lands mid-page is not scroll-locked if anything throws. */
  useEffect(() => {
    if (done) return;
    const { body } = document;
    const prev = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = prev;
    };
  }, [done]);

  // Derived, not stored: a reduced-motion visitor sees the finished mark
  // without the effect having to push state on mount.
  const shown = reduce ? 1 : progress;

  // the colour copy is revealed bottom-to-top by a growing rect
  const filled = VIEW_TOP + (VIEW_BOTTOM - VIEW_TOP) * shown;
  const clipY = VIEW_BOTTOM - (filled - VIEW_TOP);
  const clipHeight = filled - VIEW_TOP;
  const percent = Math.round(shown * 100);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          id="preloader"
          role="status"
          aria-live="polite"
          aria-label={`Loading ${site.name}`}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-frost"
          initial={false}
          exit={{
            clipPath: "inset(0% 0% 100% 0%)",
            transition: { duration: 0.6, ease: EASE },
          }}
        >
          <svg
            width="132"
            height="132"
            viewBox="0 0 120 120"
            fill="none"
            aria-hidden
            focusable="false"
          >
            <defs>
              <clipPath id="preloader-fill">
                {/* grows upward, so every visible facet is always a solid plane */}
                <rect x="0" y={clipY} width="120" height={clipHeight} />
              </clipPath>
            </defs>

            {/* unfilled state: the same planes in one flat neutral — never an
                outline, which the brand rules forbid mixing with fills */}
            {FACETS.map((f) => (
              <polygon key={`base-${f.points}`} points={f.points} fill={brand.mist} />
            ))}

            {/* colour copy, clipped to the fill line */}
            <g clipPath="url(#preloader-fill)">
              {FACETS.map((f) => (
                <polygon key={`lit-${f.points}`} points={f.points} fill={f.fill} />
              ))}
            </g>
          </svg>

          <div className="mt-10 flex w-[168px] flex-col gap-3">
            <span aria-hidden className="block h-[2px] w-full bg-rule">
              <span
                className="block h-full origin-left bg-signal"
                style={{ transform: `scaleX(${shown})` }}
              />
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-display text-[0.62rem] font-semibold tracking-[0.24em] label-tone uppercase">
                {site.wordmark}
              </span>
              <span
                aria-hidden
                className="font-display text-[0.7rem] font-semibold tracking-[0.12em] text-slate tabular-nums"
              >
                {percent}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
