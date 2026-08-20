"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { ArrowRight } from "@/components/ui/Icons";
import { EASE } from "@/lib/motion";

/**
 * Header for routes outside the homepage. The main navbar is anchor-driven and
 * its links only resolve against the one-page layout, so sub-pages get a
 * simpler bar: back to the site, and the one action that always applies.
 */
export function PageHeader({ tone = "light" }: { tone?: "light" | "onDark" }) {
  const reduce = useReducedMotion();
  const onDark = tone === "onDark";

  return (
    <motion.header
      initial={reduce ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={`absolute inset-x-0 top-0 z-50 ${onDark ? "sec-indigo bg-transparent" : ""}`}
    >
      <div className="shell flex h-[72px] items-center gap-6 sm:h-[80px]">
        <Link href="/" aria-label="Nexza Digital — back to homepage">
          <Logo size={34} tone={onDark ? "onDark" : "color"} />
        </Link>

        <nav aria-label="Secondary" className="ml-auto flex items-center gap-6">
          <Link
            href="/"
            className={`group font-display text-[0.72rem] font-semibold tracking-[0.2em] uppercase transition-colors duration-300 ${
              onDark
                ? "text-frost/70 hover:text-frost"
                : "text-midnight/65 hover:text-midnight"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <ArrowRight aria-hidden className="h-4 w-4 rotate-180" />
              Back to site
            </span>
          </Link>

          <Link href="/#contact" className="btn btn-primary hidden sm:inline-flex">
            Book a call
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
