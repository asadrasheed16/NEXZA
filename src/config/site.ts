/**
 * Brand + contact constants. Anything the client may want to change without
 * touching a component lives here.
 */
export const site = {
  name: "Nexza Digital",
  wordmark: "NEXZA",
  wordmarkSub: "DIGITAL",
  tagline: "Automation that pays for itself",
  strapline: "AI Automation · CRM · Software · Web",
  description:
    "Nexza Digital builds the systems that run behind the product: AI automations, custom CRMs, internal software and the websites in front of them.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://nexza.digital",
  domain: "nexza.digital",
  locale: "en_US",
} as const;

export const contact = {
  email: "hello@nexza.digital",
  emailHref: "mailto:hello@nexza.digital",
  cta: "Book a call",
  /** Replies within one business day — used in the contact copy. */
  responseTime: "one business day",
} as const;

export const socials = [
  { label: "LinkedIn", href: "https://linkedin.com/company/nexza-digital" },
  { label: "X", href: "https://x.com/nexzadigital" },
  { label: "GitHub", href: "https://github.com/nexzadigital" },
] as const;

/**
 * Must stay in document order — the navbar lights the last visible id in this
 * list, and the mobile drawer numbers the links from it. Reordering the page
 * without reordering this array desyncs both.
 */
export const nav = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Work", href: "#work" },
  { label: "Team", href: "#team" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
] as const;

/**
 * Brand palette, mirrored from `globals.css` for the few places that need the
 * raw values in JS (the logo facets, the generated OG image).
 */
export const brand = {
  midnight: "#101736",
  indigo: "#1B2A6B",
  indigoDeep: "#0E1740",
  signal: "#2F49B2",
  periwinkle: "#6E86E0",
  ice: "#B9C6F5",
  mist: "#E6EBF9",
  frost: "#F4F6FC",
} as const;
