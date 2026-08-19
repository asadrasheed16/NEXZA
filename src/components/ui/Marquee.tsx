"use client";

import { useState, type ReactNode } from "react";

/**
 * CSS-only infinite marquee. The children are rendered twice and the track
 * translates -50%, so the loop is seamless with zero JS on the main thread.
 * Frozen entirely under `prefers-reduced-motion` (see globals.css).
 */
export function Marquee({
  children,
  duration = 32,
  reverse = false,
  className = "",
  fade = true,
  /** Renders a pause/play control. Required by WCAG 2.2.2 when the motion
   *  runs for more than five seconds — hovering is not a keyboard mechanism. */
  pausable = false,
  pauseLabel = "scrolling text",
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
  fade?: boolean;
  pausable?: boolean;
  pauseLabel?: string;
}) {
  const [paused, setPaused] = useState(false);

  return (
    <div className="relative flex items-center">
      <div
        className={`marquee-host relative flex flex-1 overflow-hidden ${
          reverse ? "marquee-reverse" : ""
        } ${fade ? "mask-fade-x" : ""} ${className}`}
      >
        <div
          className="marquee-track"
          style={{
            ["--marquee-duration" as string]: `${duration}s`,
            animationPlayState: paused ? "paused" : undefined,
          }}
        >
          <div className="flex shrink-0 items-center">{children}</div>
          <div className="flex shrink-0 items-center" aria-hidden="true">
            {children}
          </div>
        </div>
      </div>

      {pausable && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={
            paused ? `Resume ${pauseLabel}` : `Pause ${pauseLabel}`
          }
          className="relative z-10 ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] text-ice shadow-[inset_0_0_0_1px_var(--color-rule-light)] transition-colors duration-300 hover:bg-frost/10"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="currentColor"
            aria-hidden
            focusable="false"
          >
            {paused ? (
              <path d="M8 5v14l11-7z" />
            ) : (
              <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
            )}
          </svg>
        </button>
      )}
    </div>
  );
}
