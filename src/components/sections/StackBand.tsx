"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionProps,
} from "framer-motion";
import { Marquee } from "@/components/ui/Marquee";
import { marquee, stack } from "@/data/content";
import { EASE, viewport } from "@/lib/motion";

/**
 * The "Built with" plate is cut on a single 45deg-ish plane so the scrolling
 * stack row disappears behind a facet edge rather than a soft fade.
 */
const PLATE_CLIP = "polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%)";

/** One flat plane of the mark, used as the separator between service words. */
function FacetGlyph() {
  return (
    <svg
      width="11"
      height="10"
      viewBox="0 0 12 11"
      className="shrink-0 text-ice"
      aria-hidden
      focusable="false"
    >
      <polygon points="6,0 12,11 0,11" fill="currentColor" />
    </svg>
  );
}

export function StackBand() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Counter-drift: the two rows shear apart as the band crosses the viewport.
  const driftTop = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [22, -22]);
  const driftBottom = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-14, 14]);

  // Clip-path wipes, opposed to match each row's scroll direction.
  const wipeLeft: MotionProps = reduce
    ? {}
    : {
        initial: { clipPath: "inset(0 100% 0 0)" },
        whileInView: { clipPath: "inset(0 0% 0 0)" },
        viewport,
        transition: { duration: 0.9, ease: EASE },
      };

  const wipeRight: MotionProps = reduce
    ? {}
    : {
        initial: { clipPath: "inset(0 0 0 100%)" },
        whileInView: { clipPath: "inset(0 0 0 0%)" },
        viewport,
        transition: { duration: 0.9, ease: EASE, delay: 0.12 },
      };

  return (
    <section
      ref={ref}
      aria-label="Services and technology stack"
      className="sec-indigo relative overflow-hidden py-10 md:py-14"
    >
      {/* Row 1 — service words, frost display type, facet glyph separators.
          Negative gutters give the scroll drift room without exposing an edge. */}
      <motion.div
        {...wipeLeft}
        style={{ x: driftTop }}
        className="-mx-8 will-change-transform"
      >
        <Marquee
          duration={38}
          fade={false}
          pausable
          pauseLabel="the scrolling service list"
        >
          {marquee.map((word) => (
            <span key={word} className="flex shrink-0 items-center">
              <span className="h-display whitespace-nowrap px-[clamp(1rem,2.6vw,2.2rem)] text-[clamp(1.1rem,2.4vw,1.9rem)] leading-none uppercase text-frost">
                {word}
              </span>
              <FacetGlyph />
            </span>
          ))}
        </Marquee>
      </motion.div>

      <motion.div
        aria-hidden
        className="hairline mt-7 origin-left md:mt-10"
        initial={reduce ? undefined : { scaleX: 0 }}
        whileInView={reduce ? undefined : { scaleX: 1 }}
        viewport={viewport}
        transition={{ duration: 1, ease: EASE, delay: 0.1 }}
      />

      {/* Mobile: the label sits above the row; on lg+ it becomes a pinned plate. */}
      <div className="shell mt-6 mb-1 lg:hidden">
        <span className="eyebrow">Built with</span>
      </div>

      <div className="relative mt-2 lg:mt-6">
        <motion.div
          {...wipeRight}
          style={{ x: driftBottom }}
          className="-mx-6 will-change-transform"
        >
          <Marquee reverse duration={64} fade={false} className="py-3.5">
            {stack.map((tech) => (
              <span key={tech} className="flex shrink-0 items-center">
                <span className="font-display whitespace-nowrap px-[clamp(0.9rem,2vw,1.6rem)] text-[0.72rem] font-medium tracking-[0.22em] uppercase text-ice">
                  {tech}
                </span>
                <span aria-hidden className="h-3 w-px shrink-0 bg-rule-light" />
              </span>
            ))}
          </Marquee>
        </motion.div>

        {/* lg+ label plate. The two background planes run off the left edge so
            the plate stays full-bleed; the section clips the overshoot. */}
        <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
          <div className="shell flex h-full items-center">
            <div className="relative flex h-full items-center pr-9">
              <span
                aria-hidden
                className="absolute inset-y-0 right-0 left-[-100vw] bg-indigo"
                style={{ clipPath: PLATE_CLIP }}
              />
              <span
                aria-hidden
                className="absolute inset-y-0 right-0 left-[-100vw] bg-frost/[0.07]"
                style={{ clipPath: PLATE_CLIP }}
              />
              <span className="eyebrow relative">Built with</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
