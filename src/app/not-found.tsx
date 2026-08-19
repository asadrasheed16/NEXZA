import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <main id="main" className="sec sec-frost grid-bg flex min-h-screen items-center">
      <div className="shell flex flex-col items-start gap-8">
        <Logo />
        <p className="eyebrow">Error 404</p>
        <h1 className="h-display text-[clamp(2.5rem,8vw,5rem)]">
          This page is not
          <br />
          part of the system.
        </h1>
        <p className="lede max-w-md">
          The link is broken or the page has moved. Everything we build is one
          scroll away on the homepage.
        </p>
        <Link href="/" className="btn btn-primary">
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
