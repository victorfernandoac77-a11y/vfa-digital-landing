import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useTranslation } from "@/hooks/use-translations";
import { useGetSettings } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const { t } = useTranslation();
  const { data: settings } = useGetSettings();
  const [btnTextIdx, setBtnTextIdx] = useState(0);
  
  const btnTexts = [t("hero.cta1"), t("hero.cta2"), t("hero.cta3")];

  useEffect(() => {
    const interval = setInterval(() => {
      setBtnTextIdx((prev) => (prev + 1) % btnTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [btnTexts.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* 3D Cyber Background using absolute positioning and perspective */}
      <div className="absolute inset-0 z-0 perspective-[1000px]">
        <div className="absolute inset-[-50%] bg-[url(/images/cyber-bg.png)] bg-cover bg-center opacity-30 rotate-x-[60deg] translate-y-24 animate-[cyber-scan_20s_linear_infinite_reverse]" />
        {/* Radial gradient to fade out edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_70%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full flex flex-col items-center text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="inline-block border border-primary/30 rounded-full px-4 py-1.5 mb-6 bg-black/50 backdrop-blur-md">
            <span className="text-primary font-body text-xs tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Sistemas Operativos 100%
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight min-h-[120px] md:min-h-[150px]">
            <TypeAnimation
              sequence={[
                t("hero.title1"), 2000,
                t("hero.title2"), 2000,
                t("hero.title3"), 3000
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="text-gradient"
            />
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button size="lg" className="w-full sm:w-[320px] relative overflow-hidden group">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <motion.span
              key={btnTextIdx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="block absolute w-full text-center"
            >
              {btnTexts[btnTextIdx]}
            </motion.span>
            <span className="opacity-0">{btnTexts[2]}</span> {/* Invisible placeholder for width */}
          </Button>
        </motion.div>

        {/* Stats Counters */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 grid grid-cols-3 gap-4 md:gap-12 w-full max-w-3xl"
        >
          {[
            { label: t("stats.projects"), value: settings?.stats.projects || 120, prefix: "+" },
            { label: t("stats.clients"), value: settings?.stats.clients || 50, prefix: "+" },
            { label: t("stats.experience"), value: settings?.stats.experience || 5, prefix: " Años" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center glass-panel rounded-2xl p-4 md:p-6 border-white/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
              <Counter value={stat.value} />
              <span className="text-primary font-display text-2xl md:text-4xl font-bold mt-1">
                {stat.prefix}
              </span>
              <span className="text-muted-foreground font-body text-xs md:text-sm uppercase tracking-wider mt-2">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// Simple counter animation component
function Counter({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000;
    const incrementTime = Math.abs(Math.floor(duration / end));

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span className="font-display font-bold text-4xl md:text-5xl text-white">{count}</span>;
}
