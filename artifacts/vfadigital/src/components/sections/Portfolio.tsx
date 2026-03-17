import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "@/hooks/use-translations";
import { useGetSettings } from "@workspace/api-client-react";

export function Portfolio() {
  const { t } = useTranslation();
  const { data: settings } = useGetSettings();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  // Fallback data if API not ready
  const items = settings?.portfolio || [
    { id: "1", name: "Bárbara Masajes", description: "Landing profesional para conversión y reserva de turnos de bienestar.", tags: ["UX/UI", "Conversión"] },
    { id: "2", name: "Alto Bajón", description: "Sitio web dinámico y visualmente atractivo para local gastronómico.", tags: ["E-commerce", "3D Elements"] },
    { id: "3", name: "La Tiendita de Mariana", description: "E-commerce minimalista Mobile-First.", tags: ["Mobile-First", "Next.js"] }
  ];

  return (
    <section id="portfolio" className="py-24 bg-black overflow-hidden" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
           <span className="text-primary">/</span> {t("portfolio.title")}
        </h2>
      </div>

      <div className="relative pl-4 sm:pl-6 md:pl-20">
        <motion.div 
          style={{ x }}
          className="flex gap-6 md:gap-10 w-max"
        >
          {items.map((item, i) => (
            <div 
              key={item.id} 
              className="w-[300px] md:w-[450px] shrink-0 glass-panel rounded-3xl overflow-hidden border border-white/10 group hover:border-primary/50 transition-colors"
            >
              <div className="h-[200px] md:h-[250px] bg-[#2A2A2A] relative overflow-hidden">
                <img 
                  src={`${import.meta.env.BASE_URL}images/port-${(i % 3) + 1}.png`} 
                  alt={item.name}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-display font-bold text-2xl text-white mb-3 group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <p className="font-body text-sm text-white/60 mb-6 min-h-[60px]">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-xs font-body px-3 py-1 rounded-full border border-white/20 text-white/80 bg-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
