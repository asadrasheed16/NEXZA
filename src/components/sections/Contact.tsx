"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentType,
  type FormEvent,
  type ReactNode,
  type SVGProps,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";

import { contactSection } from "@/data/content";
import { contact, site, socials } from "@/config/site";
import { EASE, viewport } from "@/lib/motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowRight, Check, LinkedIn, Mail } from "@/components/ui/Icons";

/* ------------------------------------------------------------------ glyphs */
/* Only LinkedIn ships in Icons.tsx; X and GitHub are local to this file. */

const XGlyph = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M17.53 3h3.02l-6.6 7.54L21.75 21h-6.08l-4.76-6.22L5.46 21H2.44l7.06-8.07L2.25 3h6.23l4.3 5.69L17.53 3Zm-1.06 16.2h1.67L7.6 4.72H5.8l10.67 14.48Z" />
  </svg>
);

const GitHubGlyph = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.8c.85 0 1.71.11 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .26.18.58.69.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10Z" />
  </svg>
);

type SocialLabel = (typeof socials)[number]["label"];

const SOCIAL_ICONS: Record<
  SocialLabel,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  LinkedIn,
  X: XGlyph,
  GitHub: GitHubGlyph,
};

/* ------------------------------------------------------------------ motion */

const panelIn: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: EASE,
      staggerChildren: 0.06,
      delayChildren: 0.18,
    },
  },
};

const fieldIn: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const ruleIn: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.8, ease: EASE } },
};

/* -------------------------------------------------------------------- form */

type Values = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  message: string;
};

type ErrorKey = "name" | "email" | "message";
type Errors = Partial<Record<ErrorKey, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ERROR_ORDER: readonly ErrorKey[] = ["name", "email", "message"];

/**
 * Shared control chrome: transparent field, single hairline underneath.
 * The focus ring is recoloured rather than removed — signal blue is too close
 * to indigo-deep to read as a focus state on this ground.
 */
const CONTROL =
  "peer block w-full appearance-none border-0 border-b bg-transparent py-3 pr-8 text-frost placeholder:text-frost/55 transition-colors duration-300 focus-visible:outline-ice";

/**
 * Label + control + inline error. The 2px ice line under a focused field draws
 * left to right rather than fading — the same axis move the section rules use.
 */
function Field({
  id,
  label,
  required = false,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <motion.div variants={fieldIn}>
      <label
        htmlFor={id}
        className="block text-[0.65rem] font-semibold tracking-[0.22em] text-ice/80 uppercase"
      >
        {label}
        {required && (
          <span aria-hidden className="ml-1 text-ice">
            *
          </span>
        )}
      </label>

      <span className="relative mt-1 block">
        {children}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-ice transition-transform duration-500 ease-out-expo peer-focus:scale-x-100"
        />
      </span>

      {error && (
        // #ffb4bc clears 10:1 on indigo-deep; no palette token covers error state
        <motion.p
          id={`${id}-error`}
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
          className="mt-2 text-[0.8rem] leading-snug text-alert"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}

/* ----------------------------------------------------------------- section */

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const uid = useId();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // 52px of total travel — a drift, not a parallax.
  const facetY = useTransform(scrollYProgress, [0, 1], [26, -26]);

  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    company: "",
    projectType: contactSection.projectTypes[0],
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const sentRef = useRef<HTMLParagraphElement>(null);

  // The submit button unmounts when the confirmation replaces it, which would
  // drop focus to <body>. Move focus onto the message instead so keyboard and
  // screen-reader users keep their place.
  useEffect(() => {
    if (!sent) return;
    const frame = requestAnimationFrame(() => sentRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [sent]);

  const ids = {
    name: `${uid}-name`,
    email: `${uid}-email`,
    company: `${uid}-company`,
    projectType: `${uid}-project`,
    message: `${uid}-message`,
  } as const;

  const update =
    (key: keyof Values) =>
    (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
      const value = e.target.value;
      setValues((prev) => ({ ...prev, [key]: value }));
      setSent(false);
      setErrors((prev) => {
        if (!(key in prev)) return prev;
        const next = { ...prev };
        delete next[key as ErrorKey];
        return next;
      });
    };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const next: Errors = {};
    if (!values.name.trim()) next.name = "Tell us who we're replying to.";
    if (!values.email.trim()) next.email = "We need an address to reply to.";
    else if (!EMAIL_RE.test(values.email.trim()))
      next.email = "That address doesn't look right.";
    if (!values.message.trim())
      next.message = "A sentence or two about the problem is plenty.";

    setErrors(next);

    const firstInvalid = ERROR_ORDER.find((key) => next[key]);
    if (firstInvalid) {
      document.getElementById(ids[firstInvalid])?.focus();
      return;
    }

    const company = values.company.trim();
    const subject = `${site.name} — new enquiry: ${values.projectType}`;
    const body = [
      `Name: ${values.name.trim()}`,
      `Email: ${values.email.trim()}`,
      ...(company ? [`Company: ${company}`] : []),
      `Project type: ${values.projectType}`,
      "",
      values.message.trim(),
    ].join("\n");

    window.location.href = `${contact.emailHref}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-label={contactSection.heading}
      className="sec sec-midnight grid-bg-light"
    >
      <motion.span
        aria-hidden
        style={{ y: reduce ? 0 : facetY }}
        className="facet -top-24 -left-32 h-[320px] w-[320px] rotate-180 bg-signal opacity-[0.16] will-change-transform sm:h-[460px] sm:w-[460px]"
      />

      <div className="shell relative">
        <div className="grid gap-x-12 gap-y-14 lg:grid-cols-12">
          {/* --------------------------------------------- left: the details */}
          <div className="lg:col-span-5">
            <motion.span
              aria-hidden
              className="h-display block text-[clamp(3rem,7vw,5rem)] leading-[0.85] text-ice"
              initial={reduce ? false : { clipPath: "inset(0% 0% 100% 0%)" }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
              viewport={viewport}
              transition={{ duration: 0.75, ease: EASE }}
            >
              {contactSection.index}
            </motion.span>

            <motion.span
              aria-hidden
              className="mt-7 mb-9 block h-px w-full max-w-[14rem] origin-left bg-rule-light"
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={viewport}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            />

            <SectionHeading
              eyebrow={contactSection.eyebrow}
              heading={contactSection.heading}
              sub={contactSection.sub}
            />

            {/* email is the only channel — no phone, no address */}
            <Reveal delay={0.1} className="mt-12">
              <div className="flex items-start gap-4">
                <motion.span
                  aria-hidden
                  className="grid h-12 w-12 shrink-0 place-items-center bg-ice/12 text-ice"
                  initial={reduce ? false : { clipPath: "inset(0% 0% 100% 0%)" }}
                  whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  viewport={viewport}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <Mail className="h-5 w-5" />
                </motion.span>

                <div className="min-w-0">
                  <span className="block text-[0.65rem] font-semibold tracking-[0.22em] text-ice/70 uppercase">
                    Email
                  </span>
                  <a
                    href={contact.emailHref}
                    className="h-display mt-1 block break-words text-[clamp(1.15rem,2.6vw,1.6rem)] text-frost transition-colors duration-300 hover:text-ice"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>

              <p className="mt-6 max-w-[40ch] text-frost/70">
                Send the detail once and we&rsquo;ll come back within{" "}
                {contact.responseTime} — with a straight answer, not a brochure.
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <ul className="mt-9 flex flex-wrap gap-3">
                {socials.map((social) => {
                  const Icon = SOCIAL_ICONS[social.label];
                  return (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${site.name} on ${social.label}`}
                        className="group relative grid h-11 w-11 place-items-center overflow-hidden border border-rule-light text-frost/70 transition-colors duration-300 hover:border-ice hover:text-ice"
                      >
                        {/* a single flat facet slides into the corner on hover */}
                        <span
                          aria-hidden
                          className="absolute inset-0 origin-bottom-right scale-0 bg-ice/12 transition-transform duration-500 ease-out-expo group-hover:scale-100"
                          style={{
                            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                          }}
                        />
                        <Icon aria-hidden className="relative h-4 w-4" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>

          {/* ------------------------------------------------ right: the form */}
          <div className="lg:col-span-7">
            <motion.form
              noValidate
              onSubmit={handleSubmit}
              variants={panelIn}
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              className="card relative overflow-hidden p-7 md:p-9"
            >
              <motion.span
                aria-hidden
                variants={ruleIn}
                className="absolute inset-x-0 top-0 h-[2px] origin-left bg-ice"
              />

              <div className="flex flex-col gap-7">
                <Field
                  id={ids.name}
                  label="Name"
                  required
                  error={errors.name}
                >
                  <input
                    id={ids.name}
                    name="name"
                    type="text"
                    autoComplete="name"
                    aria-required
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={
                      errors.name ? `${ids.name}-error` : undefined
                    }
                    value={values.name}
                    onChange={update("name")}
                    placeholder="Jane Okafor"
                    className={`${CONTROL} ${
                      errors.name
                        ? "border-b-alert"
                        : "border-b-frost/40 focus:border-b-ice"
                    }`}
                  />
                </Field>

                <Field
                  id={ids.email}
                  label="Email"
                  required
                  error={errors.email}
                >
                  <input
                    id={ids.email}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    aria-required
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={
                      errors.email ? `${ids.email}-error` : undefined
                    }
                    value={values.email}
                    onChange={update("email")}
                    placeholder="jane@company.com"
                    className={`${CONTROL} ${
                      errors.email
                        ? "border-b-alert"
                        : "border-b-frost/40 focus:border-b-ice"
                    }`}
                  />
                </Field>

                <Field id={ids.company} label="Company (optional)">
                  <input
                    id={ids.company}
                    name="company"
                    type="text"
                    autoComplete="organization"
                    value={values.company}
                    onChange={update("company")}
                    placeholder="Where you work"
                    className={`${CONTROL} border-b-frost/40 focus:border-b-ice`}
                  />
                </Field>

                <Field id={ids.projectType} label="Project type">
                  <select
                    id={ids.projectType}
                    name="projectType"
                    value={values.projectType}
                    onChange={update("projectType")}
                    className={`${CONTROL} cursor-pointer border-b-frost/40 focus:border-b-ice`}
                  >
                    {contactSection.projectTypes.map((type) => (
                      <option
                        key={type}
                        value={type}
                        className="bg-indigo-deep text-frost"
                      >
                        {type}
                      </option>
                    ))}
                  </select>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 right-1 -translate-y-1/2"
                  >
                    <svg viewBox="0 0 10 6" className="h-[6px] w-[10px]">
                      <polygon points="0,0 10,0 5,6" className="fill-ice" />
                    </svg>
                  </span>
                </Field>

                <Field
                  id={ids.message}
                  label="Message"
                  required
                  error={errors.message}
                >
                  <textarea
                    id={ids.message}
                    name="message"
                    rows={5}
                    aria-required
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={
                      errors.message ? `${ids.message}-error` : undefined
                    }
                    value={values.message}
                    onChange={update("message")}
                    placeholder="What's eating your team's time right now?"
                    className={`${CONTROL} resize-y ${
                      errors.message
                        ? "border-b-alert"
                        : "border-b-frost/40 focus:border-b-ice"
                    }`}
                  />
                </Field>
              </div>

              <motion.div variants={fieldIn} className="mt-9">
                <AnimatePresence mode="wait" initial={false}>
                  {sent ? (
                    <motion.p
                      key="sent"
                      ref={sentRef}
                      tabIndex={-1}
                      role="status"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="flex items-center justify-center gap-3 border border-ice/40 px-5 py-4 text-center text-ice outline-none"
                    >
                      <Check aria-hidden className="h-4 w-4 shrink-0" />
                      {contactSection.successNote}
                    </motion.p>
                  ) : (
                    <motion.button
                      key="send"
                      type="submit"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="btn btn-primary w-full"
                    >
                      Send message
                      <ArrowRight aria-hidden className="h-4 w-4" />
                    </motion.button>
                  )}
                </AnimatePresence>

                <p className="mt-4 text-center text-[0.78rem] text-frost/50">
                  This opens your email client with the details filled in.
                </p>
              </motion.div>
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
}
