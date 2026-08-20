# Nexza Digital — Agency Website

Marketing site for Nexza Digital: AI automation, CRM, software and web.
Motion-led and fully responsive, built to the **Indigo & Ice** brand presentation.
A single-page homepage plus founder portfolio routes.

## Stack

| Layer     | Choice                                                       |
| --------- | ------------------------------------------------------------ |
| Framework | Next.js 16 (App Router, React 19, TypeScript strict)          |
| Styling   | Tailwind CSS v4 (`@theme` tokens in `globals.css`, no config) |
| Motion    | framer-motion 12 + Lenis (inertial scroll)                    |
| Type      | Saira, self-hosted via `next/font`                            |
| Deploy    | Any Node host; zero-config on Vercel                          |

One photograph and no icon package — the logo, project covers, the fallback team
tiles and every icon are generated as inline SVG, so the page ships with almost
nothing to download. The single raster asset is the founder portrait in
`public/team/`, served through `next/image` (AVIF/WebP, responsive srcset).

## Getting started

```bash
npm install
```

```bash
npm run dev
```

Open <http://localhost:3000>.

```bash
npm run build
```

## Brand implementation

The brand presentation is implemented literally, not approximated.

### Palette — Indigo & Ice

| Token         | Hex       | Role              |
| ------------- | --------- | ----------------- |
| `midnight`    | `#101736` | Body text         |
| `indigo`      | `#1B2A6B` | Dark backgrounds  |
| `indigo-deep` | `#0E1740` | Deepest ground    |
| `signal`      | `#2F49B2` | Primary action    |
| `periwinkle`  | `#6E86E0` | Lines, facets     |
| `label`       | `#4A62C8` | Small label text  |
| `ice`         | `#B9C6F5` | Highlight facet   |
| `frost`       | `#F4F6FC` | Page background   |

The site is **light-led**: Frost is the page ground and Midnight the text, exactly as the
deck specifies. Indigo and Indigo-deep are used as contrast bands (Why Nexza, Contact,
Footer), never as the default.

One addition to the deck's six: Periwinkle measures only 3.16:1 on Frost, so it is used for
rules, facets and text on dark grounds, while small label **text** on light grounds uses
`label` (`#4A62C8`, 5.02:1) — the same hue family, one step darker. Use `.label-tone`
rather than `text-periwinkle` for type; it resolves per section theme.

### The mark

`src/components/ui/Logo.tsx` draws the mark from the deck's exact geometry — two peaks,
five flat facets, four tones, on a `0 0 120 120` viewBox. The rules are enforced in code:

- Straight planes only. No gradients, no shadows, no outlines mixed with fills.
- The pale ice shard in the valley is drawn last, so it always sits on top.
- Below 20px the ice shard is dropped automatically (`size < 20`).
- The `onDark` lockup shifts the whole four-tone ramp one step lighter, so the tonal
  relationship between facets is preserved and no facet is recoloured outside the palette.

`Logo` renders the `horizontal`, `stacked` and `mark` lockups; `Mark` renders the symbol alone.

### Type

Saira throughout — 700 for headlines at `-0.02em`, 500 for subheads, 300 for body
(set as the `body` weight so it is the default, per the deck).

### Visual language

The mark is flat and angular, so the interface is too: 2–4px radii instead of pills, 1px
crisp rules, `clip-path` facets for background motifs (`.facet`), a 72px square grid
texture, and motion that wipes and slides rather than bounces or glows.

## Where things live

```
src/
  app/
    layout.tsx        font, metadata, JSON-LD, skip link, scroll progress, Lenis
    page.tsx          homepage — section order lives here
    founders/
      page.tsx        /founders — index of both founders
      [slug]/page.tsx /founders/asad-rasheed, /founders/zubair-mehmood (SSG)
    globals.css       @theme tokens + .sec/.card/.btn/.eyebrow/.facet classes
    icon.svg          favicon (the mark)
    opengraph-image.tsx   generated 1200x630 social card
    sitemap.ts robots.ts not-found.tsx
  config/site.ts      brand constants, contact, socials, nav, raw palette for JS
  data/content.ts     ALL homepage copy, typed `as const`
  data/founders.ts    founder profiles + portfolios behind /founders
  lib/motion.ts       shared framer-motion variants + house easing
  components/
    ui/               Logo/Mark, Preloader, PageHeader, Reveal, SplitText,
                      SectionHeading, Marquee, CountUp, Magnetic, ScrollProgress,
                      SmoothScroll, Icons
    sections/         Navbar, Hero, StackBand, Services, Process, Work, Metrics,
                      WhyUs, Team, Faq, Contact, Footer
```

## Routes

| Route | What it is |
| --- | --- |
| `/` | The one-page site — all sections, anchor navigation |
| `/founders` | Index card for each founder, linking to their portfolio |
| `/founders/[slug]` | Individual portfolio, statically generated per founder |

Founder pages are driven entirely by `src/data/founders.ts` — add an entry and the
route, the sitemap and the index card all follow. An unknown slug 404s.

The homepage navbar is anchor-driven, so its links only resolve against the one-page
layout. Sub-pages use `PageHeader` instead (logo, back to site, book a call). The `nav`
array may mix `#anchors` and `/routes`; the navbar's section observer tracks only the
former, so a route link simply never lights.

A founder with an empty `projects` array renders `emptyNote` rather than a bare grid —
deliberately, so a portfolio can go live before every case study is written.

## Editing content

Almost nothing requires touching a component:

- **Copy** — `src/data/content.ts`
- **Email, socials, nav, brand strings** — `src/config/site.ts`
- **Colours, type, spacing, radii** — the `@theme` block at the top of `src/app/globals.css`
- **Section order** — `src/app/page.tsx`

Sections opt into a theme with `.sec-frost`, `.sec-white`, `.sec-indigo` or `.sec-midnight`.
Each theme sets `--local-fg / --local-muted / --local-line / --local-card / --local-accent`,
so `.card`, `.eyebrow`, `.btn-ghost` and `.btn-primary` adapt automatically — there are no
per-section colour overrides anywhere in the codebase.

## Motion

Scroll entrances all run through `<Reveal>` / `<RevealGroup>` so timing is consistent
site-wide; headlines use `<SplitText>` (masked per-word rise). Everything is
transform / opacity / clip-path only.

`prefers-reduced-motion: reduce` is fully honoured: CSS animations are neutralised in
`globals.css`, Lenis never initialises, `CountUp` jumps to its final value, the logo build-in
is skipped, the scroll-progress bar tracks position directly instead of springing, and every
section's scroll-linked motion is gated behind `useReducedMotion()`. Lenis is also skipped on
coarse-pointer devices, where native scrolling is better.

### Preloader

`src/components/ui/Preloader.tsx` covers the page on first paint while colour fills the
mark from the bottom up. The unfilled state is the same five planes in flat `mist` — never
an outline, which the brand rules forbid mixing with fills — and a clipped copy in full
palette colour is revealed by a rect growing upward, so every visible facet is a solid
plane at every frame. The percentage readout and the rule underneath are driven by the same
progress value, so all three stay in lockstep.

Change `FILL_SECONDS` (default `1.4`) to retime it. Under `prefers-reduced-motion` the mark
renders complete and the overlay steps aside after 320ms. A `<noscript>` rule in
`layout.tsx` hides the overlay entirely when JS is unavailable, so it can never trap anyone.

## Accessibility

Built to WCAG 2.2 AA and checked against it rather than assumed:

- **Focus indicator** — `:focus-visible` reads `--local-accent`, so the ring is Signal on
  light sections and Ice on dark ones. A single Signal ring would have measured 1.71:1 on
  Indigo; Ice on Indigo-deep is 10.25:1.
- **Contrast** — every token pair carrying text clears 4.5:1 (`slate-soft` 4.83:1,
  `label` 5.02:1, form placeholder 5.26:1) and input boundaries clear 3:1 (3.46:1).
- **Mobile drawer** — `role="dialog" aria-modal="true"` with a real Tab trap that cycles
  within the panel, Escape to close, scroll lock, and focus returned to the toggle.
- **Motion** — `MotionConfig reducedMotion="user"` wraps the app, so framer-motion drops
  transform and layout animation for those visitors; CSS animation is neutralised
  separately in `globals.css`.
- **Moving content** — the service marquee has a labelled pause/resume control
  (WCAG 2.2.2; hover-pause alone is not a keyboard mechanism).
- **Live regions** — the Work filter announces its result count, and the contact form
  moves focus to the confirmation when the submit button is replaced.

## Contact form

The form has **no backend**. It validates locally, then opens the visitor's mail client
with a prefilled message to `contact.email`. To switch to a real endpoint, replace the
submit handler in `src/components/sections/Contact.tsx` with a `fetch` to a Next.js route
handler or a form service (Resend, Formspree, etc.).

## Before going live

Items marked `TODO(client)` in `src/data/content.ts` are placeholders from the hand-off
and **must be replaced or removed**:

- [ ] **Team & founder pages** — Asad Rasheed (Founder) and Zubair Mehmood (Co-Founder) are
      live with real names and roles. Outstanding: the bios and profile paragraphs in
      `content.ts` and `founders.ts` were written here and need confirming; Zubair has no
      photo (drop a 4:5 portrait at `public/team/zubair-mehmood.jpg`, ~880×1100, and set
      `photo` on both his entries) and no portfolio entries yet.
- [ ] **Asad's portfolio entries** — Nexza Digital, Daymark, Goosi Industry and Infinitek
      Solutions are drawn from real builds, but **confirm which may be shown publicly**
      before launch. Client work in particular may need permission, and none of the four
      carries a live URL yet (`href: null` hides the link).
- [ ] **Hero stats** — `40%`, `15hrs`, `2.1x` came through as draft figures. Confirm or replace.
- [ ] **Work items** — the three case studies are representative placeholders. Swap in real
      projects, results and years.
- [ ] **Metrics band** — `40+ projects`, `25+ clients`, `6+ years`, `400+ hours automated`
      are **invented placeholders**, not measured figures. They are public claims about the
      business, so confirm or replace every one before launch (`metrics` in `content.ts`).
- [ ] Set `NEXT_PUBLIC_SITE_URL` on the host (see `.env.example`) — canonical URL, Open Graph
      and sitemap all depend on it.
- [ ] Confirm the social URLs in `src/config/site.ts` (LinkedIn, X and GitHub are assumed
      from the draft; the GitHub handle in particular is a guess).
- [ ] **"Book a call"** is the CTA on every section, but it scrolls to the enquiry form —
      there is no calendar booking. Either wire the buttons to a real scheduler
      (Cal.com, Calendly) or reword them to match what actually happens.

### Keeping the page in order

`nav` in `src/config/site.ts` must stay in document order: the navbar lights the last
visible id in that array and the mobile drawer numbers the links from it, so reordering
`src/app/page.tsx` without reordering `nav` desyncs both. The section index numerals
(`01`–`07`) live alongside the copy in `src/data/content.ts` and need the same care.
