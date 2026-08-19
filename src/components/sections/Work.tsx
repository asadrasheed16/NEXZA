"use client";

import { Fragment, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";

import { work } from "@/data/content";
import { contact } from "@/config/site";
import { EASE, viewport } from "@/lib/motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";

type Filter = (typeof work.filters)[number];
type Project = (typeof work.items)[number];

/** Cards rise in place, staggered by their position in the filtered set. */
const cardIn: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE, delay: i * 0.07 },
  }),
};

/* ---------------------------------------------------------------- covers */

/**
 * Generated covers — no photography. One family, three compositions: straight
 * planes, four tones, and in every one a single ice facet that slides on hover.
 */
const COVER_SVG = "block h-full w-full";
const MOVER = "transition-transform duration-700 ease-out-expo";

/** 01 — two interlocking peaks with the ice shard in the valley. */
function CoverPeaks() {
  return (
    <svg viewBox="0 0 400 300" className={COVER_SVG} aria-hidden focusable="false">
      <rect width="400" height="300" className="fill-indigo" />
      <polygon points="8,300 132,44 256,300" className="fill-signal" />
      <polygon points="212,300 300,110 388,300" className="fill-periwinkle" />
      <polygon points="0,300 400,214 400,300" className="fill-indigo-deep" />
      <g className={`${MOVER} group-hover:translate-x-[22px]`}>
        <polygon points="120,300 182,178 244,300" className="fill-ice" />
      </g>
    </svg>
  );
}

/** 02 — a stepped facet stack, each plane cut on the same diagonal. */
function CoverSteps() {
  return (
    <svg viewBox="0 0 400 300" className={COVER_SVG} aria-hidden focusable="false">
      <rect width="400" height="300" className="fill-indigo-deep" />
      <polygon points="0,258 400,258 400,300 0,300" className="fill-indigo" />
      <polygon points="48,258 48,220 140,192 140,258" className="fill-signal" />
      <polygon points="152,258 152,186 244,158 244,258" className="fill-periwinkle" />
      <g className={`${MOVER} group-hover:-translate-y-[18px]`}>
        <polygon points="256,258 256,148 348,120 348,258" className="fill-ice" />
      </g>
    </svg>
  );
}

/** 03 — a rotated-square lattice between two corner facets. */
const LATTICE_ROWS = [86, 152, 218] as const;
const LATTICE_COLS = [78, 166, 254, 342] as const;
const DIAMOND_R = 27;
/** The one cell painted ice — it is the mover. */
const ICE_CELL = { row: 1, col: 2 } as const;

function diamond(cx: number, cy: number, r: number) {
  return `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;
}

function CoverLattice() {
  return (
    <svg viewBox="0 0 400 300" className={COVER_SVG} aria-hidden focusable="false">
      <rect width="400" height="300" className="fill-indigo" />
      <polygon points="0,0 132,0 0,132" className="fill-indigo-deep" />
      <polygon points="400,300 268,300 400,168" className="fill-indigo-deep" />

      {LATTICE_ROWS.map((cy, row) =>
        LATTICE_COLS.map((cx, col) =>
          row === ICE_CELL.row && col === ICE_CELL.col ? null : (
            <polygon
              key={`${row}-${col}`}
              points={diamond(cx, cy, DIAMOND_R)}
              className={(row + col) % 2 === 0 ? "fill-signal" : "fill-periwinkle"}
            />
          ),
        ),
      )}

      <g className={`${MOVER} group-hover:translate-x-[26px]`}>
        <polygon
          points={diamond(
            LATTICE_COLS[ICE_CELL.col],
            LATTICE_ROWS[ICE_CELL.row],
            DIAMOND_R,
          )}
          className="fill-ice"
        />
      </g>
    </svg>
  );
}

const COVERS = [CoverPeaks, CoverSteps, CoverLattice] as const;

/* ------------------------------------------------------------------ card */

function WorkCard({
  item,
  cover,
  position,
}: {
  item: Project;
  /** Index into COVERS — taken from the source order so a card keeps its art. */
  cover: number;
  /** Position in the filtered set, used only for the entrance stagger. */
  position: number;
}) {
  const Cover = COVERS[cover % COVERS.length];

  // Filtering swaps the set outright; `layout` animates the survivors into
  // their new slots, which reads better here than an exit animation and keeps
  // the card list honest — a filtered-out card leaves the DOM immediately.
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, viewport);

  return (
    <motion.li
      ref={ref}
      layout="position"
      custom={position}
      variants={cardIn}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      {/* No case-study pages yet — every card routes to the enquiry form. */}
      <a
        href="#contact"
        aria-label={`Enquire about ${item.title}`}
        className="card group relative flex h-full flex-col overflow-hidden"
      >
        {/* signal rule wipes across the top edge on hover */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 z-20 h-[2px] origin-left scale-x-0 bg-signal transition-transform duration-500 ease-out-expo group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />

        <span className="relative block aspect-[4/3] w-full overflow-hidden bg-indigo-deep">
          <span className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]">
            <Cover />
          </span>

          {/* indigo overlay wipes up from the bottom edge */}
          <span
            aria-hidden
            className="absolute inset-0 bg-indigo/90 [clip-path:inset(100%_0_0_0)] transition-[clip-path] duration-500 ease-out-expo group-hover:[clip-path:inset(0_0_0_0)] group-focus-visible:[clip-path:inset(0_0_0_0)]"
          />
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="flex h-12 w-12 translate-y-3 items-center justify-center rounded-[2px] bg-ice text-indigo-deep opacity-0 transition-[transform,opacity] duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </span>
        </span>

        <span className="flex flex-1 flex-col p-6 md:p-7">
          <span className="flex items-baseline justify-between gap-3">
            <span className="flex flex-wrap items-baseline gap-2 text-[0.62rem] font-semibold tracking-[0.22em] label-tone uppercase">
              {item.tags.map((tag, i) => (
                <Fragment key={tag}>
                  {i > 0 && <span aria-hidden>·</span>}
                  <span>{tag}</span>
                </Fragment>
              ))}
            </span>
            <span className="shrink-0 text-[0.62rem] font-semibold tracking-[0.2em] text-slate-soft uppercase">
              {item.year}
            </span>
          </span>

          <h3 className="mt-4 text-[clamp(1.3rem,2.1vw,1.7rem)] text-midnight">
            {item.title}
          </h3>

          {/* the headline claim */}
          <p className="h-display mt-2.5 text-[clamp(1.05rem,1.7vw,1.3rem)] text-signal">
            {item.result}
          </p>

          <p className="mt-3 text-[0.93rem] text-slate">{item.body}</p>

          <span className="hairline mt-6" aria-hidden />

          <span className="mt-auto flex items-center justify-between gap-4 pt-5">
            <span className="text-[0.68rem] font-semibold tracking-[0.2em] text-slate-soft uppercase transition-colors duration-300 group-hover:text-signal">
              Enquire
            </span>
            <ArrowUpRight
              aria-hidden
              className="h-5 w-5 label-tone transition-[transform,color] duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-signal"
            />
          </span>
        </span>
      </a>
    </motion.li>
  );
}

/* --------------------------------------------------------------- section */

export function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState<Filter>(work.filters[0]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // 52px of total travel on the section index — a drift, not a parallax.
  const indexY = useTransform(scrollYProgress, [0, 1], [26, -26]);

  const indexed = work.items.map((item, i) => ({ item, i }));
  const filtered =
    active === work.filters[0]
      ? indexed
      : indexed.filter(({ item }) =>
          (item.categories as readonly string[]).includes(active),
        );

  const swap = reduce ? { duration: 0 } : { duration: 0.42, ease: EASE };

  return (
    <section
      id="work"
      ref={sectionRef}
      aria-label={work.heading}
      className="sec sec-frost"
    >
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
      <span
        aria-hidden
        className="facet bottom-[-6rem] left-[-6rem] h-72 w-72 rotate-180 bg-mist opacity-60"
      />

      <div className="shell relative">
        <div className="flex flex-col gap-9 lg:flex-row lg:items-end lg:justify-between lg:gap-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-12">
            <Reveal className="shrink-0">
              <motion.div style={reduce ? undefined : { y: indexY }}>
                <span
                  aria-hidden
                  className="h-display block text-[clamp(3rem,8vw,5.5rem)] leading-[0.85] label-tone"
                >
                  {work.index}
                </span>
                <span aria-hidden className="mt-4 block h-px w-16 bg-periwinkle" />
              </motion.div>
            </Reveal>

            <div className="min-w-0">
              <SectionHeading
                eyebrow={work.eyebrow}
                heading={work.heading}
                sub={work.sub}
              />
            </div>
          </div>

          <Reveal delay={0.12} className="lg:shrink-0 lg:pb-1">
            <div
              role="group"
              aria-label="Filter work by discipline"
              className="flex flex-wrap gap-2 lg:max-w-[24rem] lg:justify-end"
            >
              {work.filters.map((filter) => {
                const on = filter === active;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActive(filter)}
                    aria-pressed={on}
                    className={`font-display relative rounded-[2px] px-3.5 py-2 text-[0.68rem] font-semibold tracking-[0.18em] uppercase transition-colors duration-300 ${
                      on ? "text-frost" : "text-slate hover:text-signal"
                    }`}
                  >
                    {on ? (
                      <motion.span
                        aria-hidden
                        layoutId="work-filter"
                        transition={swap}
                        className="absolute inset-0 rounded-[2px] bg-signal"
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-[2px] border border-rule"
                      />
                    )}
                    <span className="relative">{filter}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* Filtering changes the result set without moving focus, so announce
            the new count for screen-reader users (WCAG 4.1.3). */}
        <p aria-live="polite" className="sr-only">
          {filtered.length} {filtered.length === 1 ? "project" : "projects"}{" "}
          shown{active === work.filters[0] ? "" : ` for ${active}`}.
        </p>

        <motion.ul
          layout
          className="mt-12 grid grid-cols-1 gap-6 md:mt-16 lg:grid-cols-3 lg:gap-7"
        >
          {filtered.map(({ item, i }, position) => (
            <WorkCard
              key={item.slug}
              item={item}
              cover={i}
              position={position}
            />
          ))}
        </motion.ul>

        {filtered.length === 0 && (
          <Reveal className="mt-10">
            <p className="lede">
              Nothing tagged {active} in this set yet — ask us, we have shipped it.
            </p>
          </Reveal>
        )}

        <Reveal
          className="mt-12 flex flex-col items-start gap-5 border-t border-rule pt-8 md:mt-14 md:flex-row md:items-center md:justify-between"
          delay={0.1}
        >
          <p className="max-w-[52ch] text-[0.93rem] text-slate">
            These are recent builds. Full case studies are in progress — until then,
            ask us about any of them directly.
          </p>
          <a href="#contact" className="btn btn-ghost shrink-0">
            {contact.cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
