import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { StackBand } from "@/components/sections/StackBand";
import { Services } from "@/components/sections/Services";
import { WhyUs } from "@/components/sections/WhyUs";
import { Process } from "@/components/sections/Process";
import { Work } from "@/components/sections/Work";
import { Metrics } from "@/components/sections/Metrics";
import { Team } from "@/components/sections/Team";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        {/* Order follows the numbered section indices in content.ts:
            Services 01, Process 02, Work 03, Why Nexza 04, Team 05, FAQ 06, Contact 07. */}
        <Hero />
        <StackBand />
        <Services />
        <Process />
        <Work />
        <Metrics />
        <WhyUs />
        <Team />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
