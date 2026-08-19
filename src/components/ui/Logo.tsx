"use client";

import { motion, useReducedMotion } from "framer-motion";
import { brand, site } from "@/config/site";

/**
 * The Nexza mark: two peaks, five flat facets, four tones.
 * Geometry is taken verbatim from the brand presentation — straight planes
 * only, no gradients, no outlines mixed with fills. The pale ice shard in the
 * valley is the highlight and always sits on top.
 */
const FACETS = [
  { points: "12,104 48,20 48,104", tone: 0 },
  { points: "48,20 84,104 48,104", tone: 1 },
  { points: "58,104 82,52 82,104", tone: 1 },
  { points: "82,52 106,104 82,104", tone: 2 },
  { points: "46,104 64,70 82,104", tone: 3 }, // ice shard — drawn last
] as const;

/**
 * Four tones, darkest to lightest. The on-dark lockup shifts the whole ramp one
 * step lighter so the tonal relationship between facets is preserved — no facet
 * is ever recoloured outside the palette.
 */
const RAMP = {
  color: [brand.indigo, brand.signal, brand.periwinkle, brand.ice],
  onDark: [brand.signal, brand.periwinkle, brand.ice, "#ffffff"],
} as const;

type Tone = keyof typeof RAMP;

export function Mark({
  size = 40,
  tone = "color",
  animate = false,
  className,
}: {
  size?: number;
  tone?: Tone;
  animate?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ramp = RAMP[tone];
  // brand rule: the ice shard is dropped below 20px
  const facets = size < 20 ? FACETS.slice(0, 4) : FACETS;
  const shouldAnimate = animate && !reduce;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      aria-hidden
      focusable="false"
    >
      {facets.map((facet, i) =>
        shouldAnimate ? (
          <motion.polygon
            key={facet.points}
            points={facet.points}
            fill={ramp[facet.tone]}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              ease: [0.16, 1, 0.3, 1],
              delay: i * 0.07,
            }}
          />
        ) : (
          <polygon
            key={facet.points}
            points={facet.points}
            fill={ramp[facet.tone]}
          />
        ),
      )}
    </svg>
  );
}

/**
 * Wordmark: NEXZA over a rule over DIGITAL, per the primary lockup.
 * Clear space on every side is half the mark's width — callers should not add
 * padding tighter than that.
 */
export function Logo({
  variant = "horizontal",
  tone = "color",
  size = 40,
  animate = false,
  className = "",
}: {
  variant?: "horizontal" | "stacked" | "mark";
  tone?: Tone;
  size?: number;
  animate?: boolean;
  className?: string;
}) {
  const onDark = tone === "onDark";
  const inkColor = onDark ? brand.frost : brand.indigo;
  const ruleColor = onDark ? "rgba(244,246,252,0.5)" : brand.periwinkle;

  if (variant === "mark") {
    return (
      <span className={className} role="img" aria-label={site.name}>
        <Mark size={size} tone={tone} animate={animate} />
      </span>
    );
  }

  const stacked = variant === "stacked";

  return (
    <span
      className={`inline-flex ${
        stacked ? "flex-col items-center gap-2" : "flex-row items-center gap-3"
      } ${className}`}
      role="img"
      aria-label={site.name}
    >
      <Mark size={size} tone={tone} animate={animate} />

      <span className="flex flex-col" style={{ color: inkColor }}>
        <span
          className="font-display font-bold leading-none"
          style={{
            fontSize: size * 0.52,
            letterSpacing: "0.06em",
          }}
        >
          {site.wordmark}
        </span>
        <span
          aria-hidden
          className="my-[0.32em] h-px w-full"
          style={{ background: ruleColor }}
        />
        <span
          className="font-display font-medium leading-none"
          style={{
            fontSize: size * 0.26,
            letterSpacing: "0.34em",
          }}
        >
          {site.wordmarkSub}
        </span>
      </span>
    </span>
  );
}
