"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { metrics } from "@/data/content";
import { EASE, viewport } from "@/lib/motion";
import { CountUp } from "@/components/ui/CountUp";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Metric = (typeof metrics.items)[number];

/** Counting and the bar underneath run on the same clock. */
const COUNT_SECONDS = 2;

function Stat({ item, index }: { item: Metric; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, viewport);
  const reduce = useReducedMotion();

  // each stat starts a beat after the one before it
  const offset = index * 0.12;

  return (
    <div
      ref={ref}
      className="relative flex flex-col gap-3 bg-white px-6 py-8 sm:px-7 lg:px-8"
    >
      {/* the numeral rises out of its own mask as the count starts */}
      <div className="overflow-hidden">
        <motion.p
          className="h-display text-[clamp(2.8rem,7vw,4.6rem)] text-indigo tabular-nums"
          initial={{ y: "110%" }}
          animate={inView ? { y: "0%" } : { y: "110%" }}
          transition={{ duration: 0.7, ease: EASE, delay: offset }}
        >
          <CountUp
            to={item.value}
            suffix={item.suffix}
            decimals={item.decimals}
            duration={COUNT_SECONDS}
          />
        </motion.p>
      </div>

      {/* fills left-to-right over exactly the counting window */}
      <span aria-hidden className="block h-[2px] w-full bg-rule">
        <motion.span
          className="block h-full origin-left bg-signal"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{
            duration: reduce ? 0 : COUNT_SECONDS,
            ease: "linear",
            delay: reduce ? 0 : offset + 0.2,
          }}
        />
      </span>

      <p className="font-display text-[0.7rem] font-semibold tracking-[0.22em] text-slate uppercase">
        {item.label}
      </p>
    </div>
  );
}

/**
 * Proof band. Sits directly after the case studies so the figures land against
 * the work they came from. Deliberately unnumbered — it is a strip, not one of
 * the numbered chapters, so it does not disturb the 01–07 sequence.
 */
export function Metrics() {
  return (
    <section className="sec sec-white grid-bg">
      {/* one flat facet, cropped by the section edge */}
      <span
        aria-hidden
        className="facet absolute -top-24 right-[-6%] hidden h-72 w-72 bg-mist md:block"
      />

      <div className="shell relative">
        <SectionHeading
          eyebrow={metrics.eyebrow}
          heading={metrics.heading}
          sub={metrics.sub}
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 grid grid-cols-1 gap-px bg-rule sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {metrics.items.map((item, i) => (
            <Stat key={item.label} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
