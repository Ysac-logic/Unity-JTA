import { MotionProvider } from "@/components/landing/motion-provider";
import { Intro } from "@/components/landing/intro";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Problem } from "@/components/landing/problem";
import { Method } from "@/components/landing/method";
import { Differentials } from "@/components/landing/differentials";
import { Team } from "@/components/landing/team";
import { MarqueeBand } from "@/components/landing/marquee-band";
import { Results } from "@/components/landing/results";
import { Plans } from "@/components/landing/plans";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { WhatsAppFab } from "@/components/landing/whatsapp-fab";

export default function LandingPage() {
  return (
    <MotionProvider>
      <Intro />
      <Header />
      <main>
        <Hero />
        <Problem />
        <Method />
        <Differentials />
        <Team />
        <MarqueeBand />
        <Results />
        <Plans />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <WhatsAppFab />
    </MotionProvider>
  );
}
