"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";

import { process as processContent } from "@/data/content";
import { EASE, viewport } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Step = (typeof processContent.steps)[number];

/**
 * Steps commit one at a time. On the desktop rail they sit in one row, so the
 * index-based delay is what produces the left-to-right cascade.
 */
const stepIn = (i: number): Variants => ({
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE,
      delay: i * 0.08,
      delayChildren: i * 0.08 + 0.12,
      staggerChildren: 0.08,
    },
  },
});

/** The facet snaps to full size and its edge commits to signal blue. */
const markerIn: Variants = {
  hidden: { scale: 0.55, borderColor: "var(--color-rule)" },
  show: {
    scale: 1,
    borderColor: "var(--color-signal)",
    transition: { duration: 0.55, ease: EASE },
  },
};

const numberIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: EASE } },
};

function StepItem({ step, index }: { step: Step; index: number }) {
  return (
    <motion.li
      variants={stepIn(index)}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className="relative flex gap-7 lg:flex-col lg:gap-0"
    >
      {/* One plane of the mark: a square turned 45deg, the number levelled back out.
          Frost fill is opaque, so it masks the rail running behind it. */}
      <motion.span
        aria-hidden
        variants={markerIn}
        className="relative z-10 flex h-11 w-11 shrink-0 rotate-45 items-center justify-center border-[1.5px] border-rule bg-frost lg:h-12 lg:w-12"
      >
        <motion.span
          variants={numberIn}
          className="h-display -rotate-45 text-[0.85rem] leading-none tracking-[0.02em] text-signal lg:text-[0.9rem]"
        >
          {step.no}
        </motion.span>
      </motion.span>

      <div className="min-w-0 pt-1.5 lg:pt-8 lg:pr-3">
        <h3 className="text-[clamp(1.2rem,1.7vw,1.45rem)] text-midnight">
          {step.title}
        </h3>
        <p className="mt-2.5 text-[0.925rem] leading-relaxed text-slate lg:text-[0.875rem]">
          {step.body}
        </p>
      </div>
    </motion.li>
  );
}

/**
 * The five stages, laid out on a rail: horizontal from `lg`, vertical below it.
 * Both orientations are rendered and toggled with responsive classes, so the
 * scroll-linked fill never depends on measuring the viewport in JS.
 */
export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // 52px and 60px of total travel — drift, not parallax.
  const indexY = useTransform(scrollYProgress, [0, 1], [26, -26]);
  const facetY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  // Draws the signal line along the rail as the steps pass through.
  const { scrollYProgress: railProgress } = useScroll({
    target: railRef,
    offset: ["start 70%", "end 60%"],
  });

  return (
    <section
      id="process"
      ref={sectionRef}
      className="sec sec-white"
      aria-label={processContent.heading}
    >
      <div
        aria-hidden
        className="grid-bg pointer-events-none absolute inset-0 opacity-60"
      />
      <motion.span
        aria-hidden
        style={{ y: reduce ? 0 : facetY }}
        className="facet -bottom-24 -left-20 h-56 w-56 rotate-180 bg-mist opacity-70 will-change-transform"
      />

      <div className="shell relative">
        <div className="flex flex-col items-center text-center">
          <motion.span
            aria-hidden
            style={reduce ? undefined : { y: indexY }}
            initial={reduce ? false : { clipPath: "inset(0% 0% 100% 0%)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
            viewport={viewport}
            transition={{ duration: 0.75, ease: EASE }}
            className="h-display block text-[clamp(3rem,8vw,5.5rem)] leading-[0.85] label-tone"
          >
            {processContent.index}
          </motion.span>

          <motion.span
            aria-hidden
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewport}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="mt-5 mb-9 block h-px w-16 bg-periwinkle"
          />

          <SectionHeading
            eyebrow={processContent.eyebrow}
            heading={processContent.heading}
            sub={processContent.sub}
            align="center"
          />
        </div>

        <div ref={railRef} className="relative mt-14 md:mt-16 lg:mt-20">
          {/* horizontal track — sits on the centre line of the lg markers (48px / 2) */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-[1.5rem] hidden h-px bg-rule lg:block"
          >
            <motion.span
              style={{ scaleX: reduce ? 1 : railProgress }}
              className="block h-full w-full origin-left bg-signal will-change-transform"
            />
          </div>

          {/* vertical track — on the centre line of the mobile markers (44px / 2) */}
          <div
            aria-hidden
            className="absolute top-[1.375rem] bottom-0 left-[1.375rem] w-px bg-rule lg:hidden"
          >
            <motion.span
              style={{ scaleY: reduce ? 1 : railProgress }}
              className="block h-full w-full origin-top bg-signal will-change-transform"
            />
          </div>

          <ol className="relative z-10 grid gap-y-10 lg:grid-cols-5 lg:gap-x-5 xl:gap-x-7">
            {processContent.steps.map((step, i) => (
              <StepItem key={step.no} step={step} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
