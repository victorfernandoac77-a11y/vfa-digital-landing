import { useEffect } from "react";
import { CyberBoot } from "@/components/shared/CyberBoot";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { AIChat } from "@/components/shared/AIChat";
import { CyberCanvas } from "@/components/shared/CyberCanvas";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Portfolio } from "@/components/sections/Portfolio";
import { Authority } from "@/components/sections/Authority";
import { Contact } from "@/components/sections/Contact";

export function Landing() {
  /* Cyber ripple global en todo toque/click */
  useEffect(() => {
    const spawnRipple = (x: number, y: number) => {
      const el = document.createElement("div");
      el.className = "cyber-ripple";
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      document.body.appendChild(el);
      el.addEventListener("animationend", () => el.remove());
    };

    const onClick = (e: MouseEvent) => spawnRipple(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      Array.from(e.changedTouches).forEach(t => spawnRipple(t.clientX, t.clientY));
    };

    window.addEventListener("click", onClick, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("touchstart", onTouch);
    };
  }, []);

  return (
    <div className="relative min-h-screen" style={{ background: "transparent" }}>
      {/* Video de fondo cyber absoluto */}
      <video
        id="vfa-bg-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/bg.mp4" type="video/mp4" />
      </video>

      {/* Red de circuitos neón sobre el video */}
      <CyberCanvas />

      <CyberBoot />
      <ScrollProgress />
      <Navbar />

      <main className="relative z-10">
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
