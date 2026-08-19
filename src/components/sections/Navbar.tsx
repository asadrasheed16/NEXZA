"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { nav as navItems, contact, socials } from "@/config/site";
import { Logo } from "@/components/ui/Logo";
import { Magnetic } from "@/components/ui/Magnetic";
import { ArrowUpRight } from "@/components/ui/Icons";
import { EASE } from "@/lib/motion";

type NavItem = (typeof navItems)[number];

const SECTION_IDS = navItems.map((item) => item.href.slice(1));

/** Header turns opaque once the hero has cleared this much of the viewport. */
const SCROLL_THRESHOLD = 40;

const ROW = "h-[72px] sm:h-[80px]";

export function Navbar() {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* --- scrolled state. Seeded in a rAF so a mid-page reload paints correctly
         without a bare setState in the effect body. ------------------------ */
  useEffect(() => {
    const read = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    const frame = requestAnimationFrame(read);
    window.addEventListener("scroll", read, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", read);
    };
  }, []);

  /* --- active section. A thin band across the middle of the viewport decides
         which link is lit; the last section in document order wins when two
         straddle it, and gaps between named sections keep the previous one. -- */
  useEffect(() => {
    const targets = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (targets.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        let next = "";
        for (const id of SECTION_IDS) if (visible.has(id)) next = id;
        setActive((prev) => next || prev);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* --- the drawer never survives a resize into the desktop layout --------- */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* --- while open: scroll locked, Escape closes, focus moves in and back -- */
  useEffect(() => {
    if (!open) return;

    const FOCUSABLE =
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      // aria-modal is a promise to the screen reader that the rest of the page
      // is inert, so Tab has to stay inside the panel to match.
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const activeEl = document.activeElement;
      if (event.shiftKey && (activeEl === first || activeEl === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeEl === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    const { body } = document;
    const html = document.documentElement;
    const prevBody = body.style.overflow;
    const prevHtml = html.style.overflow;
    const prevPad = body.style.paddingRight;
    const gutter = window.innerWidth - html.clientWidth;
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;

    const frame = requestAnimationFrame(() => panelRef.current?.focus());

    // the toggle outlives the drawer, so capturing it here is safe — and it is
    // what focus must return to once the drawer closes
    const toggle = toggleRef.current;

    return () => {
      document.removeEventListener("keydown", onKey);
      cancelAnimationFrame(frame);
      body.style.overflow = prevBody;
      html.style.overflow = prevHtml;
      body.style.paddingRight = prevPad;
      toggle?.focus();
    };
  }, [open]);

  /* ------------------------------------------------------------- variants */

  const panelVariants: Variants = reduce
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      }
    : {
        hidden: { clipPath: "inset(0% 0% 100% 0%)" },
        show: {
          clipPath: "inset(0% 0% 0% 0%)",
          transition: {
            duration: 0.55,
            ease: EASE,
            staggerChildren: 0.055,
            delayChildren: 0.16,
          },
        },
        exit: {
          clipPath: "inset(0% 0% 100% 0%)",
          transition: { duration: 0.4, ease: EASE },
        },
      };

  const itemVariants: Variants = reduce
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.2 } },
      }
    : {
        hidden: { y: "115%" },
        show: { y: "0%", transition: { duration: 0.7, ease: EASE } },
      };

  const facetVariants: Variants = reduce
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.2 } },
      }
    : {
        hidden: { y: 72, x: 24 },
        show: { y: 0, x: 0, transition: { duration: 0.7, ease: EASE } },
      };

  const close = () => setOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* frost plate + hairline, faded in past the threshold */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-frost/85 backdrop-blur-md"
        initial={false}
        animate={{ opacity: scrolled && !open ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      />
      <motion.span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-rule"
        initial={false}
        animate={{ scaleX: scrolled && !open ? 1 : 0 }}
        transition={{ duration: 0.55, ease: EASE }}
      />

      <div className={`shell relative z-10 flex ${ROW} items-center gap-6`}>
        <motion.div
          className={open ? "pointer-events-none" : undefined}
          initial={false}
          animate={{ opacity: open ? 0 : 1, scale: scrolled ? 0.94 : 1 }}
          transition={{ duration: 0.35, ease: EASE }}
          style={{ transformOrigin: "left center" }}
        >
          <Logo size={34} />
        </motion.div>

        {/* ------------------------------------------------ desktop links */}
        <nav
          aria-label="Primary"
          className="ml-auto hidden lg:flex lg:items-center"
        >
          <ul className="flex items-center gap-8">
            {navItems.map((item: NavItem) => {
              const isActive = active === item.href.slice(1);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative block py-2 font-display text-[0.72rem] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${
                      isActive
                        ? "text-signal"
                        : "text-midnight/65 hover:text-midnight"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        aria-hidden
                        layoutId={reduce ? undefined : "nav-underline"}
                        className="absolute inset-x-0 -bottom-px h-0.5 bg-signal"
                        transition={{ duration: 0.45, ease: EASE }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto hidden lg:ml-10 lg:block">
          <Magnetic strength={0.2}>
            <a href="#contact" className="btn btn-primary">
              {contact.cta}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </Magnetic>
        </div>

        {/* ---------------------------------------------------- the toggle */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2 ml-auto inline-flex h-11 w-11 items-center justify-center lg:hidden"
        >
          <span className="relative block h-4 w-6" aria-hidden>
            <motion.span
              className={`absolute left-0 block h-0.5 w-6 ${
                open ? "bg-frost" : "bg-midnight"
              }`}
              initial={false}
              animate={
                open ? { top: 7, rotate: 45 } : { top: 2, rotate: 0 }
              }
              transition={{ duration: 0.35, ease: EASE }}
            />
            <motion.span
              className={`absolute left-0 block h-0.5 w-6 ${
                open ? "bg-frost" : "bg-midnight"
              }`}
              initial={false}
              animate={
                open ? { top: 7, rotate: -45 } : { top: 12, rotate: 0 }
              }
              transition={{ duration: 0.35, ease: EASE }}
            />
          </span>
        </button>
      </div>

      {/* ------------------------------------------------- mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav"
            id="mobile-nav"
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            variants={panelVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="sec-indigo grid-bg-light fixed inset-0 overflow-x-hidden overflow-y-auto outline-none lg:hidden"
          >
            <motion.span
              aria-hidden
              variants={facetVariants}
              className="facet -right-16 -bottom-20 h-72 w-72 bg-indigo-deep"
            />

            <div className="shell relative flex min-h-full flex-col">
              <div className={`flex ${ROW} shrink-0 items-center`}>
                <Logo size={34} tone="onDark" />
              </div>

              <nav aria-label="Mobile" className="pt-6 pb-10">
                <ul>
                  {navItems.map((item: NavItem, i) => {
                    const isActive = active === item.href.slice(1);
                    return (
                      <li key={item.href} className="overflow-hidden">
                        <motion.div variants={itemVariants}>
                          <a
                            href={item.href}
                            onClick={close}
                            aria-current={isActive ? "true" : undefined}
                            className="group flex items-baseline gap-4 py-1.5"
                          >
                            <span
                              className={`font-display text-[0.7rem] font-semibold tracking-[0.22em] ${
                                isActive ? "text-ice" : "label-tone"
                              }`}
                            >
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span
                              className={`h-display text-[clamp(2rem,10vw,3.25rem)] transition-colors duration-300 ${
                                isActive
                                  ? "text-ice"
                                  : "text-frost group-hover:text-ice"
                              }`}
                            >
                              {item.label}
                            </span>
                          </a>
                        </motion.div>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="mt-auto shrink-0 overflow-hidden pb-10">
                <motion.div
                  variants={itemVariants}
                  className="border-t border-rule-light pt-7"
                >
                  <a
                    href={contact.emailHref}
                    onClick={close}
                    className="font-display text-[clamp(1.05rem,4.6vw,1.4rem)] font-semibold tracking-tight text-frost transition-colors duration-300 hover:text-ice"
                  >
                    {contact.email}
                  </a>

                  <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-3">
                    {socials.map((social) => (
                      <li key={social.label}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 font-display text-[0.7rem] font-semibold tracking-[0.22em] text-ice uppercase transition-colors duration-300 hover:text-frost"
                        >
                          {social.label}
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
