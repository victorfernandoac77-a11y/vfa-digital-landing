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
    titleKey: "services.static.title",
    tooltipKey: "services.static.tooltip",
    featuresKeys: [
      "services.static.feat1",
      "services.static.feat2",
      "services.static.feat3",
      "services.static.feat4"
    ],
    color: NEON_COLORS[0],
    settingsKey: "static" as const,
  },
  {
    id: "dynamic",
    titleKey: "services.dynamic.title",
    tooltipKey: "services.dynamic.tooltip",
    featuresKeys: [
      "services.dynamic.feat1",
      "services.dynamic.feat2",
      "services.dynamic.feat3",
      "services.dynamic.feat4"
    ],
    featured: true,
    color: NEON_COLORS[2],
    settingsKey: "dynamic" as const,
  },
  {
    id: "smart",
    titleKey: "services.smart.title",
    tooltipKey: "services.smart.tooltip",
    featuresKeys: [
      "services.smart.feat1",
      "services.smart.feat2",
      "services.smart.feat3",
      "services.smart.feat4"
    ],
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
            <span className="text-primary">/</span> {t("services.section.title")}
          </h2>
          <div className="w-24 h-1 bg-primary/30 mx-auto rounded-full" />
        </div>

        <AnimatePresence>
          {promo && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 text-center"
            >
              <button
                onClick={() => document.getElementById("service-dynamic")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-block font-display font-bold text-black bg-primary px-6 py-2 rounded-full text-base tracking-wider shadow-[0_0_20px_rgba(204,255,0,0.5)] animate-pulse"
              >
                {promo}
              </button>
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
              <div id={svc.id === "dynamic" ? "service-dynamic" : undefined} key={svc.id}>
                <ServiceCard
                  {...svc}
                  price={priceStr}
                  t={t}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  titleKey, price, tooltipKey, featuresKeys, featured, color, t,
}: {
  titleKey: string; price: string; tooltipKey: string; featuresKeys: string[];
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
          {t("services.badge.recommended")}
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
            <p className="font-body text-sm leading-relaxed">{t(tooltipKey)}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <ul className="flex-1 flex flex-col gap-4 mb-8" style={{ transform: "translateZ(20px)" }}>
        {featuresKeys.map((featKey, i) => (
          <li key={i} className="flex items-center gap-3 font-body text-sm text-white/80">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            {t(featKey)}
          </li>
        ))}
