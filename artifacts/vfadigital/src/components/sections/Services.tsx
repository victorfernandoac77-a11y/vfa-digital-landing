import { useRef } from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { useTranslation } from "@/hooks/use-translations";
import { useTilt } from "@/hooks/use-tilt";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export function Services() {
  const { t } = useTranslation();

  const services = [
    {
      id: "static",
      title: t("services.static"),
      price: "$60.000 - $120.000",
      tooltip: "¿Por qué el rango? $60k cubre tu vidriera digital rápida. Escala a $120k si requieres múltiples secciones y animaciones personalizadas.",
      features: ["Diseño Mobile-First", "Formulario de Contacto", "Integración WhatsApp", "Optimizada para velocidad"]
    },
    {
      id: "dynamic",
      title: t("services.dynamic"),
      price: "$90.000 - $160.000",
      tooltip: "¿Por qué el rango? $90k te da control de tus datos base. Escala a $160k si necesitas gestionar catálogos o promociones en tiempo real.",
      features: ["Panel de Administración", "Catálogo autogestionable", "Base de datos", "Diseño interactivo"],
      featured: true
    },
    {
      id: "smart",
      title: t("services.smart"),
      price: "$180.000 - $250.000",
      tooltip: "¿Por qué el rango? $180k incluye tu Asistente IA base y fondo 3D. Escala a $250k al entrenar a tu IA como cerrador de ventas experto con 3D a medida.",
      features: ["Asistente IA (Gemini)", "Entrenamiento en ventas", "Entornos 3D Cyber-UX", "Automatización total"]
    }
  ];

  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            <span className="text-primary">/</span> {t("services.title")}
          </h2>
          <div className="w-24 h-1 bg-primary/30 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((svc) => (
            <ServiceCard key={svc.id} {...svc} />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 glass-panel border border-primary/20 rounded-2xl p-6 text-center max-w-3xl mx-auto relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          <p className="text-sm md:text-base font-body text-white/80 relative z-10 leading-relaxed">
            {t("transparency.banner")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function ServiceCard({ title, price, tooltip, features, featured }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const { rotateX, rotateY, handlePointerMove, handlePointerLeave } = useTilt(ref);

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`glass-panel rounded-3xl p-8 relative flex flex-col h-full transition-shadow duration-300 ${
        featured ? 'border-primary shadow-[0_0_30px_rgba(204,255,0,0.15)]' : 'border-white/10 hover:border-white/30'
      }`}
    >
      {featured && (
        <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-black font-display font-bold px-4 py-1 rounded-full text-sm tracking-wider">
          RECOMENDADO
        </div>
      )}

      <h3 className="text-2xl font-display font-bold text-white mb-2" style={{ transform: "translateZ(30px)" }}>
        {title}
      </h3>
      
      <div className="flex items-center gap-2 mb-6" style={{ transform: "translateZ(40px)" }}>
        <span className="text-3xl font-display font-bold text-primary">{price}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-muted-foreground hover:text-white transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-[250px]">
            <p className="font-body text-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <ul className="flex-1 flex flex-col gap-4 mb-8" style={{ transform: "translateZ(20px)" }}>
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-3 font-body text-sm text-white/80">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(204,255,0,0.8)]" />
            {f}
          </li>
        ))}
      </ul>

      <Button variant={featured ? "default" : "outline"} className="w-full" style={{ transform: "translateZ(30px)" }}>
        Solicitar Presupuesto
      </Button>
    </motion.div>
  );
}
