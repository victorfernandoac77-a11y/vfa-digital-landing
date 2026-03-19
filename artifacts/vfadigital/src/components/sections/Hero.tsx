import { useRef } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useTranslation } from "@/hooks/use-translations";
import { useGetSettings } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function Hero() {
  const { t } = useTranslation();
  const { data: settings } = useGetSettings();

  const openChat = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(204,255,0,0.04)_0%,black_70%)]" />
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
                t("hero.title3"), 3000,
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
          <Button
            size="lg"
            className="w-full sm:w-[320px] relative overflow-hidden group rounded-[50px]"
            onClick={openChat}
          >
            VER NUESTROS SERVICIOS
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 flex justify-center gap-6 md:gap-16 w-full max-w-lg"
        >
          {[
            { label: t("stats.projects"), value: settings?.stats.projects ?? 47 },
            { label: t("stats.clients"), value: settings?.stats.clients ?? 35 },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center glass-panel rounded-2xl px-8 py-6 border-white/5 relative overflow-hidden flex-1"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <Counter value={stat.value} />
              <span className="text-primary font-display text-xl font-bold mt-1">+</span>
              <span className="text-muted-foreground font-body text-xs md:text-sm uppercase tracking-wider mt-2 text-center">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

function Counter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 2000;
          const step = Math.max(1, Math.floor(duration / value));
          const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start >= value) { setCount(value); clearInterval(timer); }
          }, step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="font-display font-bold text-4xl md:text-5xl text-white">
      {count}
    </span>
  );
                }
