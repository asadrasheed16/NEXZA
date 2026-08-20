/**
 * All marketing copy. Editing text here updates every section — no component
 * needs to be touched.
 *
 * Items marked TODO carry figures or people that must be confirmed before
 * launch; they came through as placeholders in the brand hand-off.
 */

/* ------------------------------------------------------------------ hero */

export const hero = {
  headline: ["Automation that", "pays for itself"],
  sub: "We build the systems that run behind the product: pipelines, integrations, dashboards, and the site in front of them.",
  primaryCta: { label: "Book a call", href: "#contact" },
  secondaryCta: { label: "See our work", href: "#work" },
  // TODO(client): confirm these figures before launch.
  stats: [
    { value: 40, suffix: "%", decimals: 0, label: "Less manual data entry" },
    { value: 15, suffix: " hrs", decimals: 0, label: "Saved per week on ops" },
    { value: 2.1, suffix: "x", decimals: 1, label: "Lead-to-close rate" },
  ],
  scrollHint: "Scroll",
} as const;

/** The "built with" band under the hero. */
export const stack = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
  "Node.js",
  "PostgreSQL",
  "Vercel",
] as const;

export const marquee = [
  "AI Automation",
  "CRM",
  "Software",
  "Web",
  "Integrations",
  "Dashboards",
] as const;

/* -------------------------------------------------------------- services */

export const services = {
  eyebrow: "Services",
  index: "01",
  heading: "What we build",
  sub: "Four disciplines, one outcome: less manual work, more revenue per hour of your team's time.",
  items: [
    {
      no: "01",
      title: "AI Automation",
      body: "Workflow automation, AI agents and integrations that remove manual work from your day.",
      meta: "Agents · Integrations",
      points: [
        "AI agents wired into your tools",
        "Workflow and handoff automation",
        "Third-party API integrations",
        "Document and data extraction",
      ],
    },
    {
      no: "02",
      title: "CRM",
      body: "Custom CRM systems built around how you actually sell and operate, not a generic template.",
      meta: "Pipelines · Data",
      points: [
        "Pipelines that match your sales motion",
        "Role-based access and permissions",
        "Reporting and forecast dashboards",
        "Migration from spreadsheets or legacy tools",
      ],
    },
    {
      no: "03",
      title: "Software",
      body: "Full-stack products and internal tools, built with modern frameworks and shipped fast.",
      meta: "Full-stack · Tools",
      points: [
        "Internal tools and admin panels",
        "Customer-facing web applications",
        "APIs and data services",
        "Auth, billing and infrastructure",
      ],
    },
    {
      no: "04",
      title: "Web",
      body: "Fast, responsive marketing and e-commerce websites that convert visitors into leads.",
      meta: "Sites · Commerce",
      points: [
        "Marketing sites and landing pages",
        "E-commerce storefronts",
        "CMS setup your team can edit",
        "Performance, SEO and analytics",
      ],
    },
  ],
} as const;

/* --------------------------------------------------------------- process */

export const process = {
  eyebrow: "Process",
  index: "02",
  heading: "How a project runs",
  sub: "Five stages, in order. Each one has to be true before the next starts.",
  steps: [
    {
      no: "01",
      title: "Discover",
      body: "We map how work actually moves through your business today.",
    },
    {
      no: "02",
      title: "Design",
      body: "We spec the system: data model, flows, and the interfaces people touch.",
    },
    {
      no: "03",
      title: "Build",
      body: "We ship in working increments, not a single reveal at the end.",
    },
    {
      no: "04",
      title: "Automate",
      body: "We wire the handoffs so the system runs without someone chasing it.",
    },
    {
      no: "05",
      title: "Launch",
      body: "We go live, watch the numbers, and hand over something you can run.",
    },
  ],
} as const;

/* ------------------------------------------------------------------ work */

export const work = {
  eyebrow: "Work",
  index: "03",
  heading: "Recent builds",
  sub: "A few of the systems we have shipped.",
  filters: ["All", "AI Automation", "CRM", "Software", "Web"],
  // TODO(client): replace with real projects, results and names before launch.
  items: [
    {
      slug: "ops-automation",
      title: "Operations automation",
      result: "Cut manual data entry by 40%",
      body: "Replaced a spreadsheet-and-email handoff with an automated pipeline, so records land in the CRM the moment a job is booked.",
      tags: ["CRM", "AI Automation"],
      categories: ["CRM", "AI Automation"],
      year: "2026",
    },
    {
      slug: "sales-crm",
      title: "Sales CRM & site",
      result: "2.1x lead-to-close rate",
      body: "A custom pipeline built around how the team actually sells, wired directly to the marketing site so no enquiry is retyped.",
      tags: ["Web", "CRM"],
      categories: ["Web", "CRM"],
      year: "2026",
    },
    {
      slug: "internal-tooling",
      title: "Internal tooling",
      result: "15 hrs/week saved on ops",
      body: "An internal dashboard that consolidated four disconnected tools into one view, with the routine approvals automated away.",
      tags: ["AI Automation", "Software"],
      categories: ["AI Automation", "Software"],
      year: "2025",
    },
  ],
} as const;

/* --------------------------------------------------------------- metrics */

export const metrics = {
  eyebrow: "By the numbers",
  heading: "What the work adds up to",
  sub: "Every figure below is measured from systems we have shipped, not projected.",
  // TODO(client): THESE ARE PLACEHOLDERS. Confirm or replace every figure
  // before launch — they are public claims about the business.
  items: [
    { value: 40, suffix: "+", decimals: 0, label: "Projects delivered" },
    { value: 25, suffix: "+", decimals: 0, label: "Clients served" },
    { value: 6, suffix: "+", decimals: 0, label: "Years building systems" },
    { value: 400, suffix: "+", decimals: 0, label: "Hours automated weekly" },
  ],
} as const;

/* -------------------------------------------------------------- why nexza */

export const whyUs = {
  eyebrow: "Why Nexza",
  index: "04",
  heading: "What makes this different",
  items: [
    {
      title: "Systems, not just sites",
      body: "A website with no CRM or automation behind it is a brochure. We build the whole pipeline, front to back.",
    },
    {
      title: "Automation-first thinking",
      body: "Before we design a screen, we ask what should not need a screen at all. Manual steps get removed, not decorated.",
    },
    {
      title: "Built to scale",
      body: "Architecture decisions are made for year two, not just launch week. Nothing we ship needs a rebuild in six months.",
    },
  ],
} as const;

/* ------------------------------------------------------------------ team */

export const team = {
  eyebrow: "Team",
  index: "05",
  heading: "The people who build it",
  sub: "A small senior team. The people who scope your project are the people who ship it.",
  members: [
    {
      slug: "asad-rasheed",
      initials: "AR",
      name: "Asad Rasheed",
      title: "Founder",
      role: "Software Engineer & Content Creation Manager",
      // TODO(client): confirm this bio line reads the way you want it to.
      body: "Builds the systems end to end — automations, CRMs and the platforms around them — and runs the studio's content side.",
      photo: "/team/asad-rasheed.jpg",
    },
    {
      slug: "zubair-mehmood",
      initials: "ZM",
      name: "Zubair Mehmood",
      title: "Co-Founder",
      role: "Lead Generation Head & Marketing Geek",
      // TODO(client): confirm this bio line, and add a photo at
      // public/team/zubair-mehmood.jpg then set `photo` below.
      body: "Finds the businesses whose manual work is worth automating, and makes sure the right people hear about it.",
      photo: null,
    },
  ],
} as const;

/* ------------------------------------------------------------------- faq */

export const faq = {
  eyebrow: "FAQ",
  index: "06",
  heading: "Questions worth asking first",
  items: [
    {
      q: "What exactly does Nexza build?",
      a: "Four things, usually together: AI automations and integrations, custom CRM systems, full-stack software and internal tools, and the websites in front of them. The common thread is that everything we ship is a working system, not a static page.",
    },
    {
      q: "How do you decide what is worth automating?",
      a: "We start by mapping how work actually moves through your business today. If a step is frequent, rule-based and currently manual, it is a candidate. If automating it would cost more than the time it saves, we will tell you so rather than build it.",
    },
    {
      q: "Do I need a CRM, or just a website?",
      a: "A website with nothing behind it is a brochure — it collects enquiries someone then retypes. If you are already losing leads in a spreadsheet or an inbox, the CRM is the part that pays for itself, and the site should feed it directly.",
    },
    {
      q: "How does a project actually run?",
      a: "Five stages in order: Discover, Design, Build, Automate, Launch. Each one has to be true before the next starts. We ship in working increments, so you see the system running well before launch week rather than at a single reveal.",
    },
    {
      q: "What does a project cost?",
      a: "It depends entirely on scope, so we do not publish a price list. Tell us what is eating your team's time and we will come back with a scope and a fixed number — and an honest answer if we think the work is not worth doing.",
    },
    {
      q: "What happens after launch?",
      a: "We go live, watch the numbers, and hand over something your team can actually run. Ongoing support and iteration are available, but the goal is a system that does not need us standing next to it.",
    },
  ],
} as const;

/* --------------------------------------------------------------- contact */

export const contactSection = {
  eyebrow: "Contact",
  index: "07",
  heading: "Let's automate the boring parts",
  sub: "Tell us what's eating your team's time. We'll tell you honestly whether it's worth automating.",
  projectTypes: ["AI Automation", "CRM", "Software", "Web", "Not sure yet"],
  // Nothing is actually sent — the form hands off to the visitor's mail
  // client — so the confirmation must not claim otherwise.
  successNote:
    "Your email is ready to send. Hit send and we'll reply within one business day.",
} as const;
