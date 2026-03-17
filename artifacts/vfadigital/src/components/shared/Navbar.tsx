import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslation } from "@/hooks/use-translations";
import { Button } from "@/components/ui/button";

const FLAGS = {
  es: "🇦🇷",
  en: "🇺🇸",
  pt: "🇧🇷",
  it: "🇮🇹",
  fr: "🇫🇷"
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang, t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("nav.services"), href: "#services" },
    { name: t("nav.portfolio"), href: "#portfolio" },
    { name: t("nav.authority"), href: "#authority" },
    { name: t("nav.contact"), href: "#contact" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/70 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <span className="font-display font-bold text-2xl tracking-wider text-white group-hover:neon-text transition-all">
            VFA<span className="text-primary">Digital</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-sm font-display uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
          
          {/* Language Selector */}
          <div className="flex bg-[#1A1A1A] rounded-full p-1 border border-white/10">
            {(Object.keys(FLAGS) as Array<keyof typeof FLAGS>).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                  lang === l ? "bg-primary text-black shadow-[0_0_10px_rgba(204,255,0,0.5)]" : "opacity-50 hover:opacity-100"
                }`}
              >
                {FLAGS[l]}
              </button>
            ))}
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col pt-20 px-6"
          >
            <button 
              className="absolute top-6 right-6 text-white p-2"
              onClick={() => setMobileOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>

            <div className="flex flex-col gap-8 mt-12">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-3xl font-display uppercase tracking-widest text-white hover:text-primary transition-colors border-b border-white/10 pb-4"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="mt-auto mb-12 flex justify-center gap-4">
               {(Object.keys(FLAGS) as Array<keyof typeof FLAGS>).map((l) => (
                <button
                  key={l}
                  onClick={() => { setLang(l); setMobileOpen(false); }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${
                    lang === l ? "bg-primary text-black shadow-[0_0_15px_rgba(204,255,0,0.5)]" : "bg-[#1A1A1A] opacity-50"
                  }`}
                >
                  {FLAGS[l]}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
