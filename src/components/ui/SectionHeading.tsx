"use client";

import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";

/**
 * Eyebrow + display heading + optional lede. Used by every section so the
 * vertical rhythm and reveal timing are identical throughout the page.
 */
export function SectionHeading({
  eyebrow,
  heading,
  sub,
  align = "left",
  className = "",
  highlight,
}: {
  eyebrow: string;
  heading: string;
  sub?: string;
  align?: "left" | "center";
  className?: string;
  highlight?: readonly string[];
}) {
  const centered = align === "center";

  return (
    <div
      className={`flex flex-col gap-5 ${
        centered ? "items-center text-center" : "items-start"
      } ${className}`}
    >
      <Reveal>
        <span className="eyebrow">{eyebrow}</span>
      </Reveal>

      <h2
        className={`h-display text-[clamp(1.9rem,4.4vw,3.4rem)] ${
          centered ? "max-w-3xl" : "max-w-4xl"
        }`}
      >
        <SplitText lines={[heading]} perWord highlight={highlight} />
      </h2>

      {sub && (
        <Reveal delay={0.12}>
          <p className={`lede ${centered ? "max-w-2xl" : "max-w-2xl"}`}>{sub}</p>
        </Reveal>
      )}
    </div>
  );
}
