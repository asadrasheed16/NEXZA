"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { whyUs } from "@/data/content";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp, EASE } from "@/lib/motion";

/**
 * The dark contrast band between the frost sections. Editorial rows rather than
 * cards: a rule, a number, a claim. Everything animates on a straight axis.
 */
export function WhyUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // 56px of total travel — a drift, not a parallax.
  const facetY = useTransform(scrollYProgress, [0, 1], [28, -28]);

  return (
    <section
      ref={sectionRef}
      aria-label={whyUs.heading}
      className="sec sec-indigo grid-bg-light"
    >
      <div className="shell">
        <div className="grid gap-x-12 gap-y-14 lg:grid-cols-12">
          {/* ------------------------------------------------ left: sticky head */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <motion.span
                aria-hidden
                className="h-display block text-[clamp(3rem,7vw,5rem)] leading-[0.85] text-ice"
                initial={reduce ? false : { clipPath: "inset(0% 0% 100% 0%)" }}
                whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.75, ease: EASE }}
              >
                {whyUs.index}
              </motion.span>

              <motion.span
                aria-hidden
                className="mt-7 mb-9 block h-px w-full max-w-[14rem] origin-left bg-rule-light"
                initial={reduce ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              />

              <SectionHeading eyebrow={whyUs.eyebrow} heading={whyUs.heading} />
            </div>
          </div>

          {/* ----------------------------------------------- right: the three rows */}
          <div className="relative lg:col-span-7">
            <motion.span
              aria-hidden
              style={{ y: reduce ? 0 : facetY }}
              className="facet -right-28 -top-16 z-0 h-[360px] w-[360px] bg-signal opacity-[0.18] will-change-transform sm:h-[520px] sm:w-[520px]"
            />

            <RevealGroup as="ul" className="relative z-10" stagger={0.12}>
              {whyUs.items.map((item, i) => (
                <motion.li
                  key={item.title}
                  variants={fadeUp}
                  className="group relative border-t border-rule-light"
                >
                  {/* the 2px ice line that draws across the rule on hover */}
                  <span
                    aria-hidden
                    className="absolute -top-px left-0 h-[2px] w-full origin-left scale-x-0 bg-ice transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
                  />

                  <div className="flex gap-5 pt-8 pb-9 transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5 sm:gap-8">
                    <span
                      aria-hidden
                      className="h-display w-10 shrink-0 pt-[0.15em] text-[clamp(1rem,1.5vw,1.25rem)] text-ice/70 transition-colors duration-300 group-hover:text-ice sm:w-14"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="min-w-0">
                      <h3 className="h-display text-[clamp(1.3rem,2.2vw,1.8rem)] text-frost transition-colors duration-300 group-hover:text-ice">
                        {item.title}
                      </h3>
                      <p className="mt-3 max-w-[46ch] text-frost/74">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </RevealGroup>

            <Reveal delay={0.1}>
              <div className="hairline relative z-10" aria-hidden />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
