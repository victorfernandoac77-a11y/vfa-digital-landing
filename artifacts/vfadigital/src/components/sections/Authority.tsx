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
          {/* Decorative background glow */}
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
            <Button onClick={() => setModalOpen(true)}>
              {t("authority.btn")}
            </Button>
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="w-full max-w-4xl bg-[#1A1A1A] rounded-2xl border border-white/10 overflow-hidden relative shadow-2xl">
              <button 
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-primary hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Fallback styling for iframe since we don't have real drive link */}
              <div className="w-full aspect-[4/3] bg-black flex flex-col items-center justify-center p-8 text-center border-b border-primary/20">
                <ShieldCheck className="w-24 h-24 text-primary opacity-50 mb-6" />
                <h3 className="font-display text-2xl text-white mb-2">Certificación Google UX</h3>
                <p className="text-muted-foreground font-body">[LINK_DRIVE_DIPLOMA_PLACEHOLDER]</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
