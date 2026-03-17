import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X } from "lucide-react";
import { useTranslation } from "@/hooks/use-translations";
import { Button } from "@/components/ui/button";

export function Authority() {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="authority" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="glass-panel border-primary/20 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-20px] border border-primary/30 border-dashed rounded-full"
              />
              <div className="w-40 h-40 bg-[#1A1A1A] rounded-full border-2 border-primary shadow-[0_0_30px_rgba(204,255,0,0.2)] flex items-center justify-center relative z-10">
                <ShieldCheck className="w-16 h-16 text-primary" />
              </div>
            </div>
          </div>

          <div className="md:w-1/2 text-center md:text-left z-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              {t("authority.title")}
            </h2>
            <p className="font-body text-white/70 mb-8 leading-relaxed">
              Combinamos principios estrictos de ciberseguridad con la Metodología Oficial de Google UX. Cada sistema que desarrollamos no solo es visualmente impactante, sino invulnerable y centrado 100% en la conversión del usuario.
            </p>
            <Button onClick={() => setModalOpen(true)} className="rounded-[50px]">
              {t("authority.btn")}
            </Button>
          </div>
        </div>

      </div>

      {/* Lightbox Modal con imagen real del diploma */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl bg-[#1A1A1A] rounded-2xl border border-primary/30 overflow-hidden relative shadow-[0_0_40px_rgba(204,255,0,0.15)]"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-primary hover:text-black active:bg-primary active:text-black transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>

              <img
                src="/images/diploma.jpg"
                alt="Certificado Google UX - Victor Acuña"
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
