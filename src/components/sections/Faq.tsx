"use client";

import { useId, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { faq } from "@/data/content";
import { contact } from "@/config/site";
import { collapse, fadeUp, EASE, viewport } from "@/lib/motion";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowRight, Mail, Plus } from "@/components/ui/Icons";

type FaqItem = (typeof faq.items)[number];

function Row({
  item,
  index,
  isOpen,
  onToggle,
  uid,
}: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  uid: string;
}) {
  const reduce = useReducedMotion();
  const buttonId = `${uid}-q-${index}`;
  const panelId = `${uid}-a-${index}`;

  return (
    <motion.li variants={fadeUp} className="group relative border-t border-rule">
      {/* signal rule sits solid while open, and shows a short nub on hover */}
      <span
        aria-hidden
        className={`absolute -top-px left-0 h-[2px] w-full origin-left bg-signal transition-transform duration-500 ease-out-expo ${
          isOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-[0.12]"
        }`}
      />

      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full cursor-pointer items-start gap-4 py-6 text-left sm:gap-6 sm:py-7"
        >
          <span
            aria-hidden
            className={`h-display mt-[0.42em] w-6 shrink-0 text-[0.78rem] tracking-[0.12em] transition-colors duration-300 sm:w-10 ${
              isOpen ? "text-signal" : "label-tone"
            }`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <span
            className={`h-display min-w-0 flex-1 text-[clamp(1.05rem,1.9vw,1.5rem)] transition-colors duration-300 ${
              isOpen ? "text-signal" : "text-midnight group-hover:text-signal"
            }`}
          >
            {item.q}
          </span>

          <motion.span
            aria-hidden
            initial={false}
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mt-[0.1em] flex h-7 w-7 shrink-0 items-center justify-center"
          >
            <Plus
              className={`h-5 w-5 transition-colors duration-300 ${
                isOpen ? "text-signal" : "label-tone"
              }`}
            />
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            variants={collapse}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="overflow-hidden"
          >
            <div className="flex gap-4 pb-8 sm:gap-6">
              <span aria-hidden className="w-6 shrink-0 sm:w-10" />
              {/* hairline draws down the side of the answer as it opens */}
              <motion.span
                aria-hidden
                className="w-px shrink-0 origin-top bg-periwinkle"
                initial={reduce ? false : { scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.12 }}
              />
              <p className="max-w-[54ch] pl-1 text-slate sm:pl-2">{item.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

/**
 * Editorial accordion: one answer open at a time, rows separated by hairlines
 * rather than boxes. The left column stays pinned beside the questions on lg.
 */
export function Faq() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const uid = useId();
  const [open, setOpen] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // 48px of total travel on each — a drift, not a parallax.
  const indexY = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const facetY = useTransform(scrollYProgress, [0, 1], [24, -24]);

  return (
    <section
      id="faq"
      ref={sectionRef}
      aria-label={faq.heading}
      className="sec sec-frost grid-bg"
    >
      <motion.span
        aria-hidden
        style={{ y: reduce ? 0 : facetY }}
        className="facet bottom-[-4rem] left-[-6rem] h-[300px] w-[300px] bg-mist opacity-70 will-change-transform sm:h-[420px] sm:w-[420px]"
      />

      <div className="shell relative z-10">
        <div className="grid gap-x-12 gap-y-12 lg:grid-cols-12">
          {/* ------------------------------------------------ left: sticky head */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <motion.div style={reduce ? undefined : { y: indexY }}>
                <motion.span
                  aria-hidden
                  className="h-display block text-[clamp(3rem,7vw,5rem)] leading-[0.85] label-tone"
                  initial={reduce ? false : { clipPath: "inset(0% 0% 100% 0%)" }}
                  whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  viewport={viewport}
                  transition={{ duration: 0.75, ease: EASE }}
                >
                  {faq.index}
                </motion.span>

                <motion.span
                  aria-hidden
                  className="mt-5 block h-px w-16 origin-left bg-periwinkle"
                  initial={reduce ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={viewport}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
                />
              </motion.div>

              <SectionHeading
                eyebrow={faq.eyebrow}
                heading={faq.heading}
                className="mt-8"
              />

              <Reveal delay={0.16} className="mt-10 max-w-md">
                <div className="card relative overflow-hidden p-6 md:p-7">
                  <motion.span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[2px] origin-left bg-signal"
                    initial={reduce ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={viewport}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
                  />

                  <h3 className="h-display text-[1.15rem] text-midnight">
                    Still deciding?
                  </h3>
                  <p className="mt-3 text-[0.95rem] text-slate">
                    Send the question that is not on this list — we come back
                    within {contact.responseTime} with a straight answer.
                  </p>

                  <div className="mt-6 flex flex-col items-start gap-4">
                    <a href="#contact" className="btn btn-primary">
                      {contact.cta}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </a>

                    <a
                      href={contact.emailHref}
                      className="group inline-flex items-center gap-2.5 text-[0.9rem] text-slate transition-colors duration-300 hover:text-signal"
                    >
                      <Mail
                        aria-hidden
                        className="h-4 w-4 label-tone transition-colors duration-300 group-hover:text-signal"
                      />
                      {contact.email}
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* ------------------------------------------------ right: accordion */}
          <div className="lg:col-span-7">
            <RevealGroup as="ul" stagger={0.09}>
              {faq.items.map((item, i) => (
                <Row
                  key={item.q}
                  item={item}
                  index={i}
                  uid={uid}
                  isOpen={open === i}
                  onToggle={() => setOpen(open === i ? -1 : i)}
                />
              ))}
            </RevealGroup>

            <Reveal delay={0.1}>
              <div className="hairline" aria-hidden />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
