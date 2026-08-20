import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { founders, getFounder } from "@/data/founders";
import { site, contact } from "@/config/site";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { Mark } from "@/components/ui/Logo";
import { ArrowRight, ArrowUpRight, Check } from "@/components/ui/Icons";
import { Footer } from "@/components/sections/Footer";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return founders.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const founder = getFounder(slug);
  if (!founder) return {};

  const title = `${founder.name} — ${founder.title}`;
  return {
    title,
    description: founder.summary,
    alternates: { canonical: `/founders/${founder.slug}` },
    openGraph: {
      title: `${title} | ${site.name}`,
      description: founder.summary,
      url: `${site.url}/founders/${founder.slug}`,
      type: "profile",
    },
  };
}

export default async function FounderPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const founder = getFounder(slug);
  if (!founder) notFound();

  const other = founders.find((f) => f.slug !== founder.slug);

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: founder.name,
    jobTitle: founder.role,
    description: founder.summary,
    url: `${site.url}/founders/${founder.slug}`,
    worksFor: { "@type": "Organization", name: site.name, url: site.url },
    knowsAbout: [...founder.focus],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />

      <PageHeader tone="onDark" />

      <main id="main">
        {/* ------------------------------------------------------------ hero */}
        <section className="sec sec-indigo grid-bg-light pt-[clamp(8rem,16vw,11rem)]">
          <span
            aria-hidden
            className="facet absolute -bottom-32 right-[-10%] hidden h-96 w-96 bg-signal/40 md:block"
          />

          <div className="shell relative grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <Link
                  href="/founders"
                  className="eyebrow transition-opacity duration-300 hover:opacity-70"
                >
                  All founders
                </Link>
              </Reveal>

              <h1 className="h-display mt-6 text-[clamp(2.6rem,7vw,5rem)] text-frost">
                <SplitText lines={[founder.name]} perWord />
              </h1>

              <Reveal delay={0.12}>
                <p className="mt-5 text-[0.72rem] font-semibold tracking-[0.22em] text-ice uppercase">
                  {founder.title} · {founder.role}
                </p>
              </Reveal>

              <Reveal delay={0.18}>
                <p className="lede mt-6 max-w-xl">{founder.summary}</p>
              </Reveal>

              <RevealGroup
                as="ul"
                stagger={0.07}
                className="mt-8 flex flex-wrap gap-2.5"
              >
                {founder.links.map((link) => (
                  <Reveal as="li" key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-[2px] px-4 py-2 font-display text-[0.68rem] font-semibold tracking-[0.18em] text-frost uppercase shadow-[inset_0_0_0_1px_var(--color-rule-light)] transition-colors duration-300 hover:text-ice"
                    >
                      {link.label}
                      <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                    </a>
                  </Reveal>
                ))}
              </RevealGroup>
            </div>

            <Reveal className="lg:col-span-5" delay={0.1}>
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-indigo-deep">
                {founder.photo ? (
                  <Image
                    src={founder.photo}
                    alt={`${founder.name}, ${founder.title} of ${site.name}`}
                    fill
                    sizes="(max-width: 1023px) 100vw, 40vw"
                    priority
                    className="object-cover"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Mark size={120} tone="onDark" />
                    <span
                      aria-hidden
                      className="h-display absolute bottom-7 left-7 text-[3rem] leading-none tracking-[0.04em] text-frost/85"
                    >
                      {founder.initials}
                    </span>
                  </span>
                )}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ----------------------------------------------------------- about */}
        <section className="sec sec-frost">
          <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <span className="eyebrow">Profile</span>
              </Reveal>
              {founder.about.map((para, i) => (
                <Reveal key={i} delay={0.08 + i * 0.07}>
                  <p className="lede mt-6 max-w-2xl">{para}</p>
                </Reveal>
              ))}

              <Reveal delay={0.24}>
                <div className="hairline mt-10 max-w-2xl" />
              </Reveal>

              <Reveal delay={0.28}>
                <p className="mt-8 text-[0.68rem] font-semibold tracking-[0.22em] label-tone uppercase">
                  Focus
                </p>
              </Reveal>

              <RevealGroup as="ul" stagger={0.06} className="mt-5 grid gap-3 sm:grid-cols-2">
                {founder.focus.map((item) => (
                  <Reveal as="li" key={item}>
                    <span className="flex items-start gap-3 text-[0.95rem] text-slate">
                      <Check
                        aria-hidden
                        className="mt-1 h-4 w-4 shrink-0 text-signal"
                      />
                      {item}
                    </span>
                  </Reveal>
                ))}
              </RevealGroup>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={0.12}>
                <div className="card p-7 md:p-8">
                  <p className="text-[0.68rem] font-semibold tracking-[0.22em] label-tone uppercase">
                    Works with
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {founder.skills.map((skill) => (
                      <li
                        key={skill}
                        className="rounded-[2px] px-3 py-1.5 font-display text-[0.68rem] font-medium tracking-[0.06em] text-midnight shadow-[inset_0_0_0_1px_var(--color-rule)]"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ work */}
        <section className="sec sec-white grid-bg">
          <div className="shell">
            <Reveal>
              <span className="eyebrow">Selected work</span>
            </Reveal>

            {founder.projects.length > 0 ? (
              <RevealGroup
                as="ul"
                stagger={0.09}
                className="mt-10 grid grid-cols-1 gap-px bg-rule md:mt-12 md:grid-cols-2"
              >
                {founder.projects.map((project) => {
                  const inner = (
                    <>
                      <span className="flex items-baseline justify-between gap-4">
                        <span className="text-[0.62rem] font-semibold tracking-[0.22em] label-tone uppercase">
                          {project.kind}
                        </span>
                        <span className="shrink-0 text-[0.62rem] font-semibold tracking-[0.2em] text-slate-soft uppercase">
                          {project.year}
                        </span>
                      </span>

                      <span className="h-display mt-4 block text-[clamp(1.3rem,2.1vw,1.7rem)] text-midnight">
                        {project.name}
                      </span>

                      <span className="mt-3 block text-[0.95rem] text-slate">
                        {project.body}
                      </span>

                      <span className="mt-5 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-[2px] px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.16em] text-slate uppercase shadow-[inset_0_0_0_1px_var(--color-rule)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </span>
                    </>
                  );

                  return (
                    <Reveal as="li" key={project.name}>
                      {project.href ? (
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noreferrer"
                          className="group relative flex h-full flex-col bg-white p-7 transition-colors duration-300 hover:bg-frost md:p-8"
                        >
                          <span
                            aria-hidden
                            className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-signal transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
                          />
                          {inner}
                          <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[0.68rem] font-semibold tracking-[0.2em] text-signal uppercase">
                            Visit
                            <ArrowUpRight
                              aria-hidden
                              className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                          </span>
                        </a>
                      ) : (
                        <div className="flex h-full flex-col bg-white p-7 md:p-8">
                          {inner}
                        </div>
                      )}
                    </Reveal>
                  );
                })}
              </RevealGroup>
            ) : (
              <Reveal delay={0.08}>
                <p className="lede mt-8 max-w-xl">{founder.emptyNote}</p>
              </Reveal>
            )}
          </div>
        </section>

        {/* ------------------------------------------------------------- cta */}
        <section className="sec sec-midnight grid-bg-light">
          <div className="shell flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Reveal>
                <span className="eyebrow">Next</span>
              </Reveal>
              <h2 className="h-display mt-5 max-w-2xl text-[clamp(1.9rem,4vw,3rem)]">
                <SplitText lines={["Tell us what is eating your team's time."]} perWord />
              </h2>
            </div>

            <Reveal delay={0.12}>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/#contact" className="btn btn-primary">
                  {contact.cta}
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
                {other && (
                  <Link href={`/founders/${other.slug}`} className="btn btn-ghost">
                    Meet {other.name.split(" ")[0]}
                  </Link>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
