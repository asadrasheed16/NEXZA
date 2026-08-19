"use client";

import { useRef, type ComponentType, type ReactNode, type SVGProps } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { site, contact, socials, nav as navItems } from "@/config/site";
import { EASE, fadeUp, viewport } from "@/lib/motion";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { Logo } from "@/components/ui/Logo";
import { services } from "@/data/content";
import { ArrowUpRight, LinkedIn } from "@/components/ui/Icons";

type Social = (typeof socials)[number];

/** Derived from the service list itself so the two can never drift apart. */
const SERVICE_LINKS = services.items.map((item) => ({
  label: item.title,
  href: "#services",
}));

/* ------------------------------------------------------------- local glyphs */
/* Icons.tsx has no X or GitHub mark, and it is not ours to edit. */

function XGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" {...props}>
      <path d="M17.53 3h3.02l-6.6 7.54L21.75 21h-5.9l-4.62-6.04L5.94 21H2.92l7.06-8.07L2.5 3h6.05l4.18 5.52L17.53 3Zm-1.06 16.2h1.67L7.6 4.71H5.81l10.66 14.49Z" />
    </svg>
  );
}

function GitHubGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" {...props}>
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.35 4.69-4.57 4.94.36.31.68.92.68 1.85l-.01 2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

function ArrowUpGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<Social["label"], ComponentType<SVGProps<SVGSVGElement>>> = {
  LinkedIn,
  X: XGlyph,
  GitHub: GitHubGlyph,
};

/* --------------------------------------------------------------- link atoms */

/** Text link: colour shifts to ice while a 1px ice rule draws in from the left. */
function FooterLink({
  href,
  children,
  className = "",
  /** Resting colour — kept a prop so it never collides with the base class. */
  tone = "text-frost/70",
  external = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  tone?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`group relative inline-block transition-colors duration-300 hover:text-ice ${tone} ${className}`}
    >
      {children}
      <span
        aria-hidden
        className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-ice transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
      />
    </a>
  );
}

function ColumnTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-[0.68rem] font-semibold tracking-[0.24em] label-tone uppercase">
      {children}
    </h2>
  );
}

/* -------------------------------------------------------------------- footer */

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const year = new Date().getFullYear();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  // a couple of percent of horizontal drift — the wordmark is clipped either side
  const wordX = useTransform(scrollYProgress, [0, 1], ["-1.75%", "1.75%"]);

  const toTop = () => {
    const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
    const home = document.getElementById("home");
    if (home) home.scrollIntoView({ behavior, block: "start" });
    else window.scrollTo({ top: 0, behavior });
  };

  return (
    <footer
      ref={ref}
      className="sec-indigo grid-bg-light relative overflow-clip border-t border-rule-light py-16 md:py-20"
    >
      <span
        aria-hidden
        className="facet -top-24 -right-28 h-72 w-72 rotate-180 bg-indigo-deep opacity-70"
      />

      <div className="shell relative">
        {/* ------------------------------------------------- giant wordmark */}
        <motion.div
          aria-hidden
          className="overflow-hidden"
          initial={reduce ? false : { clipPath: "inset(0% 0% 100% 0%)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
          viewport={viewport}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <motion.div
            style={reduce ? undefined : { x: wordX }}
            className="flex w-full items-end justify-between will-change-transform"
          >
            {site.wordmark.split("").map((letter, i) => (
              <span
                key={`${letter}-${i}`}
                className="h-display text-stroke-light block text-[clamp(3rem,16vw,13rem)] leading-[0.8]"
              >
                {letter}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <Reveal delay={0.12}>
          <p className="mt-6 font-display text-[0.68rem] font-semibold tracking-[0.26em] text-ice uppercase">
            {site.strapline}
          </p>
        </Reveal>

        {/* ------------------------------------------------------- columns */}
        <RevealGroup
          className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 border-t border-rule-light pt-12 sm:grid-cols-2 lg:grid-cols-4 md:mt-14 md:pt-14"
          stagger={0.1}
        >
          {/* 1 — identity */}
          <motion.div variants={fadeUp}>
            <Logo tone="onDark" size={38} />
            <p className="mt-5 max-w-[30ch] text-[0.95rem] text-frost/70">
              {site.tagline}
            </p>

            <ul className="mt-6 flex flex-wrap gap-2.5">
              {socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.label];
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-[2px] border border-rule-light text-ice transition-colors duration-300 hover:border-ice hover:text-indigo-deep"
                    >
                      {/* ice plane wipes up from the bottom edge */}
                      <span
                        aria-hidden
                        className="absolute inset-0 origin-bottom scale-y-0 bg-ice transition-transform duration-500 ease-out-expo group-hover:scale-y-100"
                      />
                      <Icon className="relative h-4 w-4" />
                      <span className="sr-only">{social.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* 2 — site */}
          <motion.nav variants={fadeUp} aria-label="Footer">
            <ColumnTitle>Site</ColumnTitle>
            <ul className="mt-5 flex flex-col items-start gap-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* 3 — services */}
          <motion.nav variants={fadeUp} aria-label="Services">
            <ColumnTitle>Services</ColumnTitle>
            <ul className="mt-5 flex flex-col items-start gap-3">
              {SERVICE_LINKS.map((item) => (
                <li key={item.label}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* 4 — contact */}
          <motion.div variants={fadeUp}>
            <ColumnTitle>Get in touch</ColumnTitle>
            <FooterLink
              href={contact.emailHref}
              tone="text-frost"
              className="mt-5 font-display text-[clamp(1rem,1.4vw,1.15rem)] font-medium tracking-tight"
            >
              {contact.email}
            </FooterLink>

            <div className="mt-7">
              <a href="#contact" className="btn btn-primary">
                {contact.cta}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </motion.div>
        </RevealGroup>

        {/* ----------------------------------------------------- bottom bar */}
        <Reveal
          className="mt-14 flex flex-col gap-5 border-t border-rule-light pt-7 sm:flex-row sm:items-center sm:justify-between"
          delay={0.1}
        >
          <p className="text-[0.82rem] text-frost/60">
            © {year} {site.name}. All rights reserved.
          </p>

          <button
            type="button"
            onClick={toTop}
            className="group inline-flex items-center gap-3 self-start font-display text-[0.7rem] font-semibold tracking-[0.22em] text-ice uppercase transition-colors duration-300 hover:text-frost sm:self-auto"
          >
            Back to top
            <span
              aria-hidden
              className="inline-flex h-9 w-9 items-center justify-center rounded-[2px] border border-rule-light transition-colors duration-300 group-hover:border-ice"
            >
              <ArrowUpGlyph className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1" />
            </span>
          </button>
        </Reveal>
      </div>
    </footer>
  );
}
