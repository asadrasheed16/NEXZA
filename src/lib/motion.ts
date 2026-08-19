import type { Variants, Transition } from "framer-motion";

/** House easing — matches the CSS `--ease-out-expo` token. */
export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const;

export const transition: Transition = { duration: 0.7, ease: EASE };
export const transitionFast: Transition = { duration: 0.45, ease: EASE };

/**
 * Viewport config used by every scroll-triggered animation on the site.
 * `once` keeps re-scroll cheap; the negative bottom margin makes elements
 * commit a little before they are fully on screen.
 */
export const viewport = { once: true, margin: "-80px 0px -80px 0px" } as const;

/** Fade + rise. The default entrance for almost everything. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  show: { opacity: 1, x: 0, transition },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  show: { opacity: 1, x: 0, transition },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition },
};

/** Parent that releases its children one after another. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** Masked line reveal — pair with an `overflow-hidden` wrapper. */
export const lineMask: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.9, ease: EASE } },
};

/** Accordion body. */
export const collapse: Variants = {
  hidden: { height: 0, opacity: 0, transition: { duration: 0.35, ease: EASE } },
  show: {
    height: "auto",
    opacity: 1,
    transition: { height: { duration: 0.4, ease: EASE }, opacity: { duration: 0.3, delay: 0.1 } },
  },
};
