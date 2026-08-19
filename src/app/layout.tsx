import type { Metadata, Viewport } from "next";
import { Saira } from "next/font/google";
import { site, contact, socials, brand } from "@/config/site";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { Preloader } from "@/components/ui/Preloader";
import "./globals.css";

/**
 * Saira — semi-condensed grotesque with loopless letterforms, per the brand
 * presentation. 300 is the body weight, 700 the headline weight.
 */
const saira = Saira({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-saira",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "AI automation agency",
    "custom CRM development",
    "workflow automation",
    "AI agents for business",
    "internal tools development",
    "Next.js development agency",
    "systems integration",
    "business process automation",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    site: "@nexzadigital",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: brand.frost,
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

/**
 * `Organization`, not `ProfessionalService` — the latter is a LocalBusiness
 * subtype and Google expects a postal address on it. This client publishes
 * none, so claiming a local business would be a structured-data error.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  description: site.description,
  url: site.url,
  email: contact.email,
  sameAs: socials.map((s) => s.href),
  areaServed: "Worldwide",
  knowsAbout: [
    "AI Automation",
    "CRM Development",
    "Software Development",
    "Web Development",
    "Systems Integration",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={saira.variable}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-signal focus:px-5 focus:py-2.5 focus:font-display focus:text-sm focus:font-semibold focus:text-frost"
        >
          Skip to content
        </a>
        {/* The overlay is removed by JS, so make sure a no-JS visitor never
            sees it at all rather than being stuck behind it. */}
        <noscript>
          <style>{`#preloader{display:none !important}`}</style>
        </noscript>
        <Preloader />
        <ScrollProgress />
        <SmoothScroll />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
