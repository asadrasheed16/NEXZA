"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";

import { team } from "@/data/content";
import { site } from "@/config/site";
import { EASE } from "@/lib/motion";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowUpRight } from "@/components/ui/Icons";

type Member = (typeof team.members)[number];

/* ------------------------------------------------------------------ motion */

type CardMotion = {
  card: Variants;
  tile: Variants;
  facet: Variants;
  rule: Variants;
  line: Variants;
};

/**
 * One motion set, built twice: the reduced variant keeps the same sequencing
 * so the card still assembles in order, but strips every bit of travel.
 */
function buildMotion(reduce: boolean): CardMotion {
  const travel = reduce ? 0 : 1;

  return {
    card: {
      hidden: { opacity: 0, y: 26 * travel },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.65,
          ease: EASE,
          staggerChildren: 0.06,
          delayChildren: 0.16,
        },
      },
    },
    // the tile wipes open along the vertical axis, planes and all
    tile: {
      hidden: {
        opacity: reduce ? 0 : 1,
        clipPath: reduce ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
      },
      show: {
        opacity: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        transition: { duration: 0.7, ease: EASE, staggerChildren: 0.07 },
      },
    },
    facet: {
      hidden: { opacity: 0, y: 5 * travel },
      show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
    },
    rule: {
      hidden: { opacity: reduce ? 0 : 1, scaleX: reduce ? 1 : 0 },
      show: {
        opacity: 1,
        scaleX: 1,
        transition: { duration: 0.7, ease: EASE },
      },
    },
    line: {
      hidden: { opacity: 0, y: 10 * travel },
      show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
    },
  };
}

const MOTION = {
  full: buildMotion(false),
  reduced: buildMotion(true),
} as const;

/* ------------------------------------------------------------------- tiles */

/**
 * Portrait tiles, not photographs: flat compositions of straight planes in the
 * four brand tones, one per member. The last plane in each set is the one that
 * slides on hover — the centre of every composition stays dark so the frost
 * initials keep their contrast.
 */
const TILES = [
  {
    slide: "group-hover:translate-x-[-10px]",
    facets: [
      { points: "0,0 100,0 100,125 0,125", fill: "fill-indigo" },
      { points: "0,125 0,44 56,125", fill: "fill-signal" },
      { points: "42,0 100,0 100,62", fill: "fill-periwinkle" },
      { points: "100,125 100,74 58,125", fill: "fill-ice" },
    ],
  },
  {
    slide: "group-hover:translate-x-[10px]",
    facets: [
      { points: "0,0 100,0 100,125 0,125", fill: "fill-indigo-deep" },
      { points: "0,0 62,0 0,78", fill: "fill-signal" },
      { points: "100,125 100,38 34,125", fill: "fill-periwinkle" },
      { points: "0,125 0,88 46,125", fill: "fill-ice" },
    ],
  },
  {
    slide: "group-hover:translate-y-[10px]",
    facets: [
      { points: "0,0 100,0 100,125 0,125", fill: "fill-signal" },
      { points: "0,0 100,0 100,50 0,86", fill: "fill-indigo" },
      { points: "0,125 0,112 100,86 100,125", fill: "fill-periwinkle" },
      { points: "54,0 100,0 100,42", fill: "fill-ice" },
    ],
  },
] as const;

/* -------------------------------------------------------------------- card */

function MemberCard({ member, index }: { member: Member; index: number }) {
  const reduce = useReducedMotion();
  const v = reduce ? MOTION.reduced : MOTION.full;
  const tile = TILES[index % TILES.length];
  const no = String(index + 1).padStart(2, "0");

  return (
    <motion.li
      variants={v.card}
      className="card card-hover group relative flex h-full flex-col p-8"
    >
      <motion.div
        variants={v.tile}
        className="relative aspect-[4/5] w-full overflow-hidden bg-indigo-deep"
      >
        {member.photo ? (
          <Image
            src={member.photo}
            alt={`${member.name}, ${member.title} of ${site.name}`}
            fill
            sizes="(max-width: 767px) 100vw, 42vw"
            className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
          />
        ) : (
          <>
            <svg
              viewBox="0 0 100 125"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              aria-hidden
              focusable="false"
            >
              {tile.facets.map((facet, i) => {
                const isLast = i === tile.facets.length - 1;
                const polygon = (
                  <motion.polygon
                    variants={v.facet}
                    points={facet.points}
                    className={facet.fill}
                  />
                );

                // the sliding plane gets its own <g> so the CSS transition on the
                // group never fights framer's inline transform on the polygon
                return isLast ? (
                  <g
                    key={facet.points}
                    className={`transition-transform duration-500 ease-out-expo ${tile.slide}`}
                  >
                    {polygon}
                  </g>
                ) : (
                  <g key={facet.points}>{polygon}</g>
                );
              })}
            </svg>

            <span
              aria-hidden
              className="h-display absolute inset-0 flex items-center justify-center text-[clamp(2.4rem,6vw,3.25rem)] leading-none tracking-[0.04em] text-frost"
            >
              {member.initials}
            </span>
          </>
        )}

        {/* solid chip so the index stays legible over a photo as well as a tile */}
        <span
          aria-hidden
          className="absolute top-0 left-0 bg-indigo-deep px-2.5 py-1.5 text-[0.62rem] font-semibold tracking-[0.22em] text-frost/80 uppercase"
        >
          {no}
        </span>
      </motion.div>

      <motion.h3
        variants={v.line}
        className="mt-7 text-[clamp(1.25rem,2vw,1.5rem)] text-midnight"
      >
        {member.name}
      </motion.h3>

      <motion.p
        variants={v.line}
        className="mt-2 text-[0.68rem] font-semibold tracking-[0.2em] text-signal uppercase"
      >
        {member.title}
      </motion.p>

      <motion.p
        variants={v.line}
        className="mt-1.5 text-[0.8rem] leading-snug text-slate"
      >
        {member.role}
      </motion.p>

      <motion.p variants={v.line} className="mt-3 text-[0.95rem] text-slate">
        {member.body}
      </motion.p>

      <motion.div variants={v.line} className="mt-auto pt-7">
        <motion.span
          variants={v.rule}
          aria-hidden
          className="hairline block origin-left"
        />

        <Link
          href={`/founders/${member.slug}`}
          aria-label={`View ${member.name}'s portfolio`}
          className="group/link mt-5 inline-flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.2em] text-signal uppercase transition-colors duration-300 hover:text-indigo"
        >
          View portfolio
          <ArrowUpRight
            aria-hidden
            className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
          />
        </Link>
      </motion.div>
    </motion.li>
  );
}

/* ----------------------------------------------------------------- section */

export function Team() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // 48px of total travel on the section index — a drift, not a parallax
  const indexY = useTransform(scrollYProgress, [0, 1], [24, -24]);


  return (
    <section
      id="team"
      ref={sectionRef}
      aria-label={team.heading}
      className="sec sec-white"
    >
      <span
        aria-hidden
        className="facet -top-24 left-[-7rem] h-72 w-72 rotate-180 bg-mist opacity-70"
      />
      <span
        aria-hidden
        className="facet right-[-6rem] -bottom-28 h-64 w-64 bg-mist opacity-60"
      />

      <div className="shell relative">
        <div className="flex flex-col items-center gap-8">
          <Reveal>
            <motion.div
              style={reduce ? undefined : { y: indexY }}
              className="flex flex-col items-center will-change-transform"
            >
              <span
                aria-hidden
                className="h-display block text-[clamp(3rem,8vw,5.5rem)] leading-[0.85] label-tone"
              >
                {team.index}
              </span>
              <span
                aria-hidden
                className="mt-4 block h-px w-16 bg-periwinkle"
              />
            </motion.div>
          </Reveal>

          <SectionHeading
            eyebrow={team.eyebrow}
            heading={team.heading}
            sub={team.sub}
            align="center"
            className="w-full"
          />
        </div>

        <RevealGroup
          as="ul"
          stagger={0.12}
          className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-5 md:mt-16 md:grid-cols-2 md:gap-6"
        >
          {team.members.map((member, i) => (
            <MemberCard key={member.slug} member={member} index={i} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
