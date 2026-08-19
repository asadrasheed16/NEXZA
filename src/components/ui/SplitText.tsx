"use client";

import { motion } from "framer-motion";
import { EASE, viewport } from "@/lib/motion";

type Props = {
  /** One entry per visual line. Each line rises out of its own mask. */
  lines: readonly string[];
  className?: string;
  /** Reveal word-by-word inside each line instead of the whole line at once. */
  perWord?: boolean;
  delay?: number;
  /** Words listed here are painted in the signal-blue accent. */
  highlight?: readonly string[];
};

/**
 * Masked headline reveal. Lines (or words) are clipped by an
 * `overflow-hidden` wrapper and slide up into view on scroll.
 */
export function SplitText({
  lines,
  className,
  perWord = false,
  delay = 0,
  highlight = [],
}: Props) {
  const hot = new Set(highlight.map((w) => w.toLowerCase().replace(/[.,]/g, "")));
  let wordIndex = 0;

  return (
    <span className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block overflow-hidden pb-[0.12em]">
          {perWord ? (
            <span className="block">
              {line.split(" ").map((word) => {
                const i = wordIndex++;
                const isHot = hot.has(word.toLowerCase().replace(/[.,]/g, ""));
                return (
                  <motion.span
                    key={`${li}-${i}`}
                    className="inline-block will-change-transform"
                    style={isHot ? { color: "var(--color-signal)" } : undefined}
                    initial={{ y: "110%" }}
                    whileInView={{ y: "0%" }}
                    viewport={viewport}
                    transition={{
                      duration: 0.85,
                      ease: EASE,
                      delay: delay + i * 0.045,
                    }}
                  >
                    {word}
                    {" "}
                  </motion.span>
                );
              })}
            </span>
          ) : (
            <motion.span
              className="block will-change-transform"
              initial={{ y: "110%" }}
              whileInView={{ y: "0%" }}
              viewport={viewport}
              transition={{ duration: 0.9, ease: EASE, delay: delay + li * 0.1 }}
            >
              {line}
            </motion.span>
          )}
        </span>
      ))}
    </span>
  );
}
