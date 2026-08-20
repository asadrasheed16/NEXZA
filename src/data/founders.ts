/**
 * Founder profiles behind /founders and /founders/[slug].
 *
 * Everything marked TODO(client) needs confirming before launch — a portfolio
 * makes public claims about people and, where the work was for a client, about
 * that client too.
 */

export type FounderProject = {
  name: string;
  kind: string;
  year: string;
  body: string;
  /** Live URL if the work is public. `null` renders the entry without a link. */
  href: string | null;
  tags: readonly string[];
};

export type Founder = {
  slug: string;
  name: string;
  initials: string;
  title: string;
  role: string;
  /** One line, used on cards and as the page lede. */
  summary: string;
  /** Longer profile, one paragraph per entry. */
  about: readonly string[];
  focus: readonly string[];
  skills: readonly string[];
  photo: string | null;
  links: readonly { label: string; href: string }[];
  projects: readonly FounderProject[];
  /** Shown in place of the grid when `projects` is empty. */
  emptyNote: string;
};

export const foundersPage = {
  eyebrow: "Founders",
  heading: "The two people behind Nexza",
  sub: "One builds the systems, the other finds the businesses that need them. Both are hands-on — the people who scope your project are the people who ship it.",
} as const;

export const founders: readonly Founder[] = [
  {
    slug: "asad-rasheed",
    name: "Asad Rasheed",
    initials: "AR",
    title: "Founder",
    role: "Software Engineer & Content Creation Manager",
    summary:
      "Builds the systems end to end — automations, CRMs and the platforms around them — and runs the studio's content side.",
    // TODO(client): confirm this profile reads the way you want it to.
    about: [
      "Asad founded Nexza to build the part of the product most agencies skip: the pipelines, integrations and internal tools that actually run a business once the marketing site has done its job.",
      "He works across the whole stack — data model and architecture through to the interface people touch — and handles the studio's content and brand output alongside it.",
    ],
    focus: [
      "Automation & AI agents",
      "Custom CRM systems",
      "Full-stack product work",
      "Marketing sites & e-commerce",
    ],
    skills: [
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "MongoDB",
      "Tailwind CSS",
      "Framer Motion",
      "React Native",
      "Vercel",
    ],
    photo: "/team/asad-rasheed.jpg",
    // TODO(client): confirm these handles before launch.
    links: [
      { label: "LinkedIn", href: "https://linkedin.com/company/nexza-digital" },
      { label: "GitHub", href: "https://github.com/nexzadigital" },
      { label: "Email", href: "mailto:hello@nexza.digital" },
    ],
    // TODO(client): these are drawn from real builds, but confirm which may be
    // shown publicly — client work in particular — and add live URLs.
    projects: [
      {
        name: "Nexza Digital",
        kind: "Agency platform",
        year: "2026",
        body: "This site. Next.js 16 and Tailwind v4, built to a strict flat-facet brand system with a motion layer that holds up to WCAG 2.2 AA.",
        href: null,
        tags: ["Next.js", "Design system", "Motion"],
      },
      {
        name: "Daymark",
        kind: "Product",
        year: "2026",
        body: "A daily tracking app with a versioned data model, built to stay fast as the history grows rather than degrading after a few months of entries.",
        href: null,
        tags: ["Product", "Data model", "App"],
      },
      {
        name: "Goosi Industry",
        kind: "Client · B2B",
        year: "2026",
        body: "Marketing and inquiry platform for a sportswear manufacturer, spanning two divisions off one codebase with a route-driven catalogue and kinetic typography.",
        href: null,
        tags: ["Next.js", "Catalogue", "B2B"],
      },
      {
        name: "Infinitek Solutions",
        kind: "Client · Agency site",
        year: "2026",
        body: "A full agency site build — services, work, pricing and an enquiry flow — delivered as a single motion-led page.",
        href: null,
        tags: ["Next.js", "Marketing site"],
      },
    ],
    emptyNote: "",
  },
  {
    slug: "zubair-mehmood",
    name: "Zubair Mehmood",
    initials: "ZM",
    title: "Co-Founder",
    role: "Lead Generation Head & Marketing Geek",
    summary:
      "Finds the businesses whose manual work is worth automating, and makes sure the right people hear about it.",
    // TODO(client): Zubair to confirm or rewrite this profile.
    about: [
      "Zubair runs lead generation and marketing at Nexza — working out which businesses are losing the most time to manual process, and getting in front of them before they go looking.",
      "He sits close to the build side rather than apart from it, so what gets promised in a pitch is what the team can actually ship.",
    ],
    focus: [
      "Lead generation",
      "Outbound & positioning",
      "Marketing strategy",
      "Client discovery",
    ],
    skills: [
      "Lead generation",
      "Outbound campaigns",
      "Market research",
      "CRM pipelines",
      "Content strategy",
      "Analytics",
    ],
    // TODO(client): add a 4:5 portrait at public/team/zubair-mehmood.jpg and
    // set it here. Until then the faceted brand tile stands in.
    photo: null,
    links: [
      { label: "LinkedIn", href: "https://linkedin.com/company/nexza-digital" },
      { label: "Email", href: "mailto:hello@nexza.digital" },
    ],
    // TODO(client): add real campaigns or accounts once Zubair confirms what
    // can be shown. Deliberately empty rather than filled with invented work.
    projects: [],
    emptyNote:
      "Selected work is being written up. In the meantime, ask about lead generation and positioning directly — the fastest answer is a conversation.",
  },
];

export function getFounder(slug: string): Founder | undefined {
  return founders.find((f) => f.slug === slug);
}
