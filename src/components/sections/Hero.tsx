"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { hero } from "@/data/content";
import { site } from "@/config/site";
import { EASE, viewport } from "@/lib/motion";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { Magnetic } from "@/components/ui/Magnetic";
import { CountUp } from "@/components/ui/CountUp";
import { ArrowUpRight, ArrowRight } from "@/components/ui/Icons";

/**
 * First screen. Flat faceted planes drift off the right edge on scroll while
 * the content column lifts and fades — the only two scroll-linked effects here,
 * both under 60px of travel.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 56]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const planeA = useTransform(scrollYProgress, [0, 1], [0, -46]);
  const planeB = useTransform(scrollYProgress, [0, 1], [0, 38]);
  const planeC = useTransform(scrollYProgress, [0, 1], [0, -24]);

  return (
    <section
      ref={ref}
      id="home"
      aria-labelledby="hero-title"
      className="sec sec-frost grid-bg flex min-h-svh items-center pt-[clamp(7rem,15vw,9.5rem)] pb-[clamp(4.5rem,9vw,7rem)]"
    >
      {/* Background motif: three flat planes, clipped by the section. */}
      <div className="absolute inset-0" aria-hidden>
        <motion.span
          className="facet bg-mist"
          style={{
            y: reduce ? 0 : planeA,
            top: "-6%",
            right: "-14%",
            width: "clamp(320px, 52vw, 720px)",
            height: "clamp(300px, 58vh, 640px)",
            rotate: 180,
          }}
        />
        <motion.span
          className="facet bg-ice/40"
          style={{
            y: reduce ? 0 : planeB,
            bottom: "-18%",
            right: "-7%",
            width: "clamp(220px, 34vw, 470px)",
            height: "clamp(220px, 40vh, 430px)",
          }}
        />
        <motion.span
          className="facet hidden bg-periwinkle/20 md:block"
          style={{
            y: reduce ? 0 : planeC,
            top: "5%",
            right: "27%",
            width: "clamp(90px, 12vw, 180px)",
            height: "clamp(160px, 30vh, 320px)",
            rotate: 180,
          }}
        />
      </div>

      <div className="shell relative z-10">
        <motion.div
          style={{
            y: reduce ? 0 : contentY,
            opacity: reduce ? 1 : contentOpacity,
          }}
        >
          {/* strapline */}
          <p className="flex items-center gap-3 font-display text-[0.68rem] font-semibold uppercase tracking-[0.24em] label-tone sm:text-[0.72rem]">
            <motion.span
              aria-hidden
              className="block h-[2px] w-7 origin-left bg-signal"
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
            />
            {site.strapline}
          </p>

          <h1
            id="hero-title"
            className="h-display mt-6 text-[clamp(2.8rem,8vw,6.5rem)] text-midnight"
          >
            <SplitText lines={hero.headline} perWord highlight={["pays"]} />
          </h1>

          <Reveal delay={0.28}>
            <p className="lede mt-7 max-w-xl">{hero.sub}</p>
          </Reveal>

          <Reveal delay={0.38}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Magnetic>
                <a
                  href={hero.primaryCta.href}
                  className="btn btn-primary group"
                >
                  {hero.primaryCta.label}
                  <ArrowUpRight
                    width={16}
                    height={16}
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </Magnetic>

              <a href={hero.secondaryCta.href} className="btn btn-ghost group">
                {hero.secondaryCta.label}
                <ArrowRight
                  width={16}
                  height={16}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </div>
          </Reveal>

          {/* stats */}
          <div className="mt-14 max-w-3xl">
            <motion.span
              aria-hidden
              className="block h-px w-full origin-left bg-rule"
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={viewport}
              transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}
            />

            <dl className="mt-8 grid grid-cols-1 gap-y-8 sm:grid-cols-3 sm:gap-y-0">
              {hero.stats.map((stat, i) => (
                <Reveal
                  key={stat.label}
                  delay={0.5 + i * 0.09}
                  className={[
                    "flex flex-col-reverse gap-1.5",
                    i > 0 ? "sm:border-l sm:border-rule sm:pl-6 lg:pl-8" : "",
                    i < hero.stats.length - 1 ? "sm:pr-6 lg:pr-8" : "",
                  ].join(" ")}
                >
                  <dt className="font-display text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate">
                    {stat.label}
                  </dt>
                  <dd className="h-display text-[clamp(2rem,4vw,3.2rem)] text-indigo">
                    <CountUp
                      to={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </motion.div>
      </div>

      {/* scroll hint */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[clamp(1.5rem,4vw,2.75rem)] z-10 hidden md:block">
        <div className="shell">
          <div className="flex flex-col items-start gap-3">
            <span className="font-display text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-slate-soft">
              {hero.scrollHint}
            </span>
            <span
              aria-hidden
              className="relative block h-14 w-px overflow-hidden bg-rule"
            >
              {reduce ? (
                <span className="absolute inset-x-0 top-0 block h-5 bg-signal" />
              ) : (
                <motion.span
                  className="absolute inset-x-0 top-0 block h-5 bg-signal will-change-transform"
                  animate={{ y: ["-100%", "280%"] }}
                  transition={{
                    duration: 2.1,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />
              )}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
