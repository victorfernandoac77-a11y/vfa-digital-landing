import { CyberBoot } from "@/components/shared/CyberBoot";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { AIChat } from "@/components/shared/AIChat";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Portfolio } from "@/components/sections/Portfolio";
import { Authority } from "@/components/sections/Authority";
import { Contact } from "@/components/sections/Contact";

export function Landing() {
  return (
    <div className="relative min-h-screen bg-black">
      <CyberBoot />
      <ScrollProgress />
      <Navbar />
      
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <Authority />
        <Contact />
      </main>

      <Footer />
      <AIChat />
    </div>
  );
}
