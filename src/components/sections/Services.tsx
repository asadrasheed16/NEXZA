"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";

import { services } from "@/data/content";
import { contact } from "@/config/site";
import { EASE, viewport } from "@/lib/motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowRight, ArrowUpRight, Check } from "@/components/ui/Icons";

type Service = (typeof services.items)[number];

/** Card shell: fades up, then releases its own contents in sequence. */
const cardIn: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: EASE,
      staggerChildren: 0.055,
      delayChildren: 0.18,
    },
  },
};

/** Facets drop into place one plane at a time, like the mark assembling. */
const facetIn: Variants = {
  hidden: { opacity: 0, y: 7 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

const ruleIn: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.7, ease: EASE } },
};

const pointIn: Variants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

/**
 * Three flat planes echoing the two peaks of the mark. Straight edges only —
 * no strokes, no gradients.
 */
function FacetGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 26"
      className={className}
      aria-hidden
      focusable="false"
    >
      <motion.polygon variants={facetIn} points="0,26 13,2 13,26" className="fill-signal" />
      <motion.polygon variants={facetIn} points="13,2 26,26 13,26" className="fill-ice" />
      <motion.polygon variants={facetIn} points="26,26 35,11 44,26" className="fill-signal" />
    </svg>
  );
}

function ServiceCard({ item }: { item: Service }) {
  return (
    <motion.li
      variants={cardIn}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className="card card-hover group relative flex h-full flex-col overflow-hidden p-7 md:p-9"
    >
      {/* signal rule wipes across the top edge on hover */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-signal transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />

      <div className="flex items-start justify-between gap-4">
        <span
          aria-hidden
          className="h-display text-[2rem] leading-none text-mist transition-colors duration-300 group-hover:label-tone"
        >
          {item.no}
        </span>
        <span className="pt-1 text-right text-[0.65rem] font-semibold tracking-[0.22em] label-tone uppercase">
          {item.meta}
        </span>
      </div>

      <FacetGlyph className="mt-8 h-[26px] w-[44px]" />

      <h3 className="mt-5 text-[clamp(1.4rem,2.4vw,1.9rem)] text-midnight">
        {item.title}
      </h3>

      <p className="mt-3 text-slate">{item.body}</p>

      <motion.span variants={ruleIn} className="hairline mt-7 origin-left" />

      <ul className="mt-5 flex flex-col gap-2.5">
        {item.points.map((point) => (
          <motion.li
            key={point}
            variants={pointIn}
            className="flex items-start gap-3 text-[0.9rem] leading-relaxed text-slate"
          >
            <Check className="mt-[0.42rem] h-3.5 w-3.5 shrink-0 text-signal" aria-hidden />
            <span>{point}</span>
          </motion.li>
        ))}
      </ul>

      <span className="mt-auto flex justify-end pt-8">
        <ArrowUpRight
          aria-hidden
          className="h-6 w-6 label-tone transition-[transform,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-signal"
        />
      </span>
    </motion.li>
  );
}

export function Services() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // short, axis-locked drift on the section index — well under 60px of travel
  const indexY = useTransform(scrollYProgress, [0, 1], [26, -26]);

  return (
    <section id="services" ref={ref} className="sec sec-frost" aria-label={services.heading}>
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
      <span
        aria-hidden
        className="facet top-[-5rem] right-[-6rem] h-64 w-64 rotate-180 bg-mist opacity-60"
      />

      <div className="shell relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-12">
          <Reveal className="shrink-0">
            <motion.div style={reduce ? undefined : { y: indexY }}>
              <span
                aria-hidden
                className="h-display block text-[clamp(3rem,8vw,5.5rem)] leading-[0.85] label-tone"
              >
                {services.index}
              </span>
              <span aria-hidden className="mt-4 block h-px w-16 bg-periwinkle" />
            </motion.div>
          </Reveal>

          <div className="min-w-0">
            <SectionHeading
              eyebrow={services.eyebrow}
              heading={services.heading}
              sub={services.sub}
            />
          </div>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-2 md:gap-6">
          {services.items.map((item) => (
            <ServiceCard key={item.no} item={item} />
          ))}
        </ul>

        <Reveal
          className="mt-14 flex flex-col items-center gap-5 text-center md:mt-16"
          delay={0.1}
        >
          <p className="lede">Not sure which of these you need?</p>
          <a href="#contact" className="btn btn-ghost">
            {contact.cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
