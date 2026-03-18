import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/hooks/use-translations";
import { useTilt } from "@/hooks/use-tilt";
import { useGetSettings } from "@workspace/api-client-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const NEON_COLORS = ["#00FFFF", "#FF00FF", "#CCFF00", "#FF6600", "#AA00FF"];

const BASE_SERVICES = [
  {
    id: "static",
    titleKey: "services.static",
    tooltip: "¿Por qué el rango? $60k cubre tu vidriera digital rápida. Escala a $120k si requieres múltiples secciones y animaciones personalizadas.",
    features: ["Diseño Mobile-First", "Formulario de Contacto", "Integración WhatsApp", "Optimizada para velocidad"],
    color: NEON_COLORS[0],
    settingsKey: "static" as const,
  },
  {
    id: "dynamic",
    titleKey: "services.dynamic",
    tooltip: "¿Por qué el rango? $90k te da control de tus datos base. Escala a $160k si necesitas gestionar catálogos o promociones en tiempo real.",
    features: ["Panel de Administración", "Catálogo autogestionable", "Base de datos", "Diseño interactivo"],
    featured: true,
    color: NEON_COLORS[2],
    settingsKey: "dynamic" as const,
  },
  {
    id: "smart",
    titleKey: "services.smart",
    tooltip: "¿Por qué el rango? $180k incluye tu Asistente IA base y fondo 3D. Escala a $250k al entrenar a tu IA como cerrador de ventas experto con 3D a medida.",
    features: ["Asistente IA (Gemini)", "Entrenamiento en ventas", "Entornos 3D Cyber-UX", "Automatización total"],
    color: NEON_COLORS[4],
    settingsKey: "smart" as const,
  },
];

function openChatWidget() {
  window.dispatchEvent(new CustomEvent("vfa:open-chat"));
  setTimeout(() => {
    document.getElementById("vfa-chat-anchor")?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, 100);
}

function fmt(n: number) {
  return `$${n.toLocaleString("es-AR")}`;
}

export function Services() {
  const { t } = useTranslation();
  const { data: settings } = useGetSettings();
  const promo = (settings as { promo?: string } | undefined)?.promo || "";

  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            <span className="text-primary">/</span> {t("services.title")}
          </h2>
          <div className="w-24 h-1 bg-primary/30 mx-auto rounded-full" />
        </div>

        {/* Banner Promocional — solo si hay contenido */}
        <AnimatePresence>
          {promo && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 text-center"
            >
              <span className="inline-block font-display font-bold text-black bg-primary px-6 py-2 rounded-full text-base tracking-wider shadow-[0_0_20px_rgba(204,255,0,0.5)] animate-pulse">
                {promo}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          {BASE_SERVICES.map((svc) => {
            const prices = settings?.services?.[svc.settingsKey];
            const priceStr = prices
              ? `${fmt(prices.priceMin)} - ${fmt(prices.priceMax)}`
              : svc.settingsKey === "static"
              ? "$60.000 - $120.000"
              : svc.settingsKey === "dynamic"
              ? "$90.000 - $160.000"
              : "$180.000 - $250.000";
            return (
              <ServiceCard
                key={svc.id}
                {...svc}
                price={priceStr}
                t={t}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  titleKey, price, tooltip, features, featured, color, t,
}: {
  titleKey: string; price: string; tooltip: string; features: string[];
  featured?: boolean; color: string; t: (k: string) => string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { rotateX, rotateY, handlePointerMove, handlePointerLeave } = useTilt(ref);

  const handleCTA = (e: React.MouseEvent<HTMLButtonElement>) => {
    window.dispatchEvent(new CustomEvent("vfa:particle-burst", {
      detail: { x: e.clientX, y: e.clientY, color }
    }));
    openChatWidget();
  };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`glass-panel rounded-3xl p-8 relative flex flex-col h-full transition-shadow duration-300 ${
        featured
          ? "border-primary shadow-[0_0_30px_rgba(204,255,0,0.15)]"
          : "border-white/10 hover:border-white/30"
      }`}
    >
      {featured && (
        <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-black font-display font-bold px-4 py-1 rounded-full text-sm tracking-wider">
          RECOMENDADO
        </div>
      )}

      <h3 className="text-2xl font-display font-bold text-white mb-2" style={{ transform: "translateZ(30px)" }}>
        {t(titleKey)}
      </h3>

      <div className="flex items-center gap-2 mb-6" style={{ transform: "translateZ(40px)" }}>
        <span className="text-xl font-display font-bold text-primary">{price}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-muted-foreground hover:text-white transition-colors touch-manipulation">
              <HelpCircle className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent
            className="max-w-[260px] bg-[#1A1A1A] border border-primary/30 text-white rounded-xl p-4"
            side="top"
          >
            <p className="font-body text-sm leading-relaxed">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <ul className="flex-1 flex flex-col gap-4 mb-8" style={{ transform: "translateZ(20px)" }}>
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 font-body text-sm text-white/80">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <Button
        variant={featured ? "default" : "outline"}
        className="w-full rounded-[50px]"
        style={{ transform: "translateZ(30px)" }}
        onClick={handleCTA}
      >
        Solicitar Presupuesto
      </Button>
    </motion.div>
  );
}
