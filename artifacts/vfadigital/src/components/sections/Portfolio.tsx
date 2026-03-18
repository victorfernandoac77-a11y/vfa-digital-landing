import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { useTranslation } from "@/hooks/use-translations";
import { useGetSettings } from "@workspace/api-client-react";

const MODAL_DETAILS: Record<string, { tech: string; case: string }> = {
  "barbara-masajes": {
    tech: "React · Vite · WhatsApp API · Google Maps",
    case:
      "Bárbara necesitaba reemplazar su presencia en Instagram por una web propia. Diseñamos una landing Mobile-First con formulario de reserva de turnos integrado directamente a su WhatsApp. Resultado: +70% de conversión en consultas en el primer mes."
  },
  "alto-bajon": {
    tech: "Next.js · Panel Admin · Menú Online dinámico",
    case:
      "Local gastronómico porteño sin presencia digital. Creamos un sitio dinámico con menú online autogestionable y galería de fotos. El dueño actualiza precios y platos desde el panel en 2 minutos sin tocar código."
  },
  "tiendita-mariana": {
    tech: "E-commerce · Carrito · MercadoPago · Mobile-First",
    case:
      "Emprendimiento de productos artesanales que vendía solo por Instagram. Implementamos un catálogo digital con carrito y pago online vía MercadoPago. En el primer fin de semana de lanzamiento, Mariana triplicó sus ventas habituales."
  }
};

const FALLBACK = [
  { id: "barbara-masajes", name: "Bárbara Masajes", description: "Landing profesional para conversión y reserva de turnos de bienestar.", tags: ["Landing Page", "Reservas", "Bienestar"], type: "static" },
  { id: "alto-bajon", name: "Alto Bajón", description: "Sitio web dinámico y visualmente atractivo para local gastronómico.", tags: ["Gastronomía", "Dinámico", "Menú Online"], type: "dynamic" },
  { id: "tiendita-mariana", name: "La Tiendita de Mariana", description: "E-commerce minimalista Mobile-First.", tags: ["E-commerce", "Mobile-First", "Ventas"], type: "smart" }
];

export function Portfolio() {
  const { t } = useTranslation();
  const { data: settings } = useGetSettings();
  const items = settings?.portfolio || FALLBACK;
  const [selected, setSelected] = useState<typeof FALLBACK[0] | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="portfolio" className="py-24 overflow-hidden" style={{ background: "rgba(0,0,0,0.2)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
          <span className="text-primary">/</span> {t("portfolio.title")}
        </h2>
        <p className="text-muted-foreground font-body text-sm">Deslizá para ver los proyectos →</p>
      </div>

      {/* Carrusel horizontal con scroll-snap */}
      <div
        ref={scrollRef}
        className="portfolio-scroll flex gap-5 overflow-x-auto px-4 sm:px-6 pb-4"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            className="portfolio-card w-[82vw] sm:w-[420px] shrink-0 glass-panel rounded-3xl overflow-hidden border border-white/10 cursor-pointer"
            whileHover={{ scale: 1.02, borderColor: "rgba(204,255,0,0.5)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelected(item)}
          >
            {/* Imagen del proyecto */}
            <div className="h-[190px] sm:h-[240px] bg-[#1A1A1A] relative overflow-hidden">
              <img
                src={`${import.meta.env.BASE_URL}images/port-${(i % 3) + 1}.png`}
                alt={item.name}
                className="w-full h-full object-cover opacity-60 hover:opacity-90 hover:scale-105 transition-all duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 right-3 flex items-center gap-1 text-primary text-xs font-body bg-black/50 px-2 py-1 rounded-full">
                <ExternalLink className="w-3 h-3" /> Ver detalle
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-primary transition-colors">
                {item.name}
              </h3>
              <p className="font-body text-xs text-white/55 mb-4 leading-relaxed line-clamp-2">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <span key={tag} className="text-xs font-body px-2.5 py-1 rounded-full border border-white/20 text-white/70 bg-white/5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dots indicadores */}
      <div className="flex justify-center gap-2 mt-5">
        {items.map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-white/20" />
        ))}
      </div>

      {/* Modal / Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9990] bg-black/92 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.88, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.88, y: 24 }}
              transition={{ type: "spring", damping: 22, stiffness: 200 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-xl glass-panel rounded-3xl overflow-hidden border border-primary/30 shadow-[0_0_40px_rgba(204,255,0,0.12)]"
            >
              {/* Imagen grande */}
              <div className="relative h-[200px] sm:h-[260px] bg-[#1A1A1A]">
                <img
                  src={`${import.meta.env.BASE_URL}images/port-${(items.findIndex(i => i.id === selected.id) % 3) + 1}.png`}
                  alt={selected.name}
                  className="w-full h-full object-cover opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white hover:bg-primary hover:text-black active:bg-primary active:text-black transition-all"
                  aria-label="Cerrar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Contenido */}
              <div className="p-6">
                <h3 className="font-display font-bold text-2xl text-white mb-1">{selected.name}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selected.tags.map(tag => (
                    <span key={tag} className="text-xs font-body px-2.5 py-1 rounded-full border border-primary/30 text-primary bg-primary/5">
                      {tag}
                    </span>
                  ))}
                </div>

                {MODAL_DETAILS[selected.id] && (
                  <>
                    <p className="text-xs font-body text-primary/70 mb-3 tracking-wider uppercase">
                      Stack: {MODAL_DETAILS[selected.id].tech}
                    </p>
                    <p className="font-body text-sm text-white/70 leading-relaxed">
                      {MODAL_DETAILS[selected.id].case}
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
