import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { founders, foundersPage } from "@/data/founders";
import { site } from "@/config/site";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Mark } from "@/components/ui/Logo";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Founders",
  description: foundersPage.sub,
  alternates: { canonical: "/founders" },
  openGraph: {
    title: `Founders | ${site.name}`,
    description: foundersPage.sub,
    url: `${site.url}/founders`,
  },
};

export default function FoundersPage() {
  return (
    <>
      <PageHeader />

      <main id="main">
        <section className="sec sec-frost grid-bg pt-[clamp(8rem,16vw,11rem)]">
          <span
            aria-hidden
            className="facet absolute -top-20 right-[-8%] hidden h-80 w-80 bg-mist md:block"
          />

          <div className="shell relative">
            <SectionHeading
              as="h1"
              eyebrow={foundersPage.eyebrow}
              heading={foundersPage.heading}
              sub={foundersPage.sub}
            />

            <RevealGroup
              as="ul"
              stagger={0.12}
              className="mt-14 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2"
            >
              {founders.map((founder, i) => (
                <Reveal as="li" key={founder.slug}>
                  <Link
                    href={`/founders/${founder.slug}`}
                    className="card card-hover group flex h-full flex-col overflow-hidden"
                  >
                    <span className="relative block aspect-[4/5] w-full overflow-hidden bg-indigo-deep">
                      {founder.photo ? (
                        <Image
                          src={founder.photo}
                          alt={`${founder.name}, ${founder.title} of ${site.name}`}
                          fill
                          sizes="(max-width: 767px) 100vw, 46vw"
                          priority={i === 0}
                          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Mark size={92} tone="onDark" />
                          <span
                            aria-hidden
                            className="h-display absolute bottom-6 left-6 text-[2.4rem] leading-none tracking-[0.04em] text-frost/85"
                          >
                            {founder.initials}
                          </span>
                        </span>
                      )}

                      <span
                        aria-hidden
                        className="absolute top-0 left-0 bg-indigo-deep px-2.5 py-1.5 text-[0.62rem] font-semibold tracking-[0.22em] text-frost/80 uppercase"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </span>

                    <span className="flex flex-1 flex-col p-7 md:p-8">
                      <span className="h-display text-[clamp(1.4rem,2.4vw,1.9rem)] text-midnight">
                        {founder.name}
                      </span>
                      <span className="mt-2 text-[0.68rem] font-semibold tracking-[0.2em] text-signal uppercase">
                        {founder.title}
                      </span>
                      <span className="mt-1.5 text-[0.8rem] leading-snug text-slate">
                        {founder.role}
                      </span>
                      <span className="mt-4 text-[0.95rem] text-slate">
                        {founder.summary}
                      </span>

                      <span className="mt-auto flex items-center gap-2 pt-7 text-[0.7rem] font-semibold tracking-[0.2em] text-signal uppercase">
                        View portfolio
                        <ArrowUpRight
                          aria-hidden
                          className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </RevealGroup>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
