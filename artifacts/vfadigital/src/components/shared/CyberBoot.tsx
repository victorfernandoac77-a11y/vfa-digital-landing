import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/use-translations";

export function CyberBoot() {
  const [show, setShow] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    // Prevent scrolling while booting
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = 'auto';
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeOut" } }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
          {/* Matrix scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(204,255,0,0.05)_1px,transparent_1px)] bg-[size:100%_4px] opacity-20 pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-b from-primary/20 to-transparent animate-scan pointer-events-none" />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative w-24 h-24 border-2 border-primary/30 rounded-full flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute inset-0 border-t-2 border-primary rounded-full"
              />
              <span className="font-display text-primary text-2xl font-bold">VFA</span>
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1] }}
              transition={{ delay: 0.5, duration: 1.5 }}
              className="text-primary font-body tracking-widest text-lg md:text-xl uppercase shadow-primary drop-shadow-[0_0_10px_rgba(204,255,0,0.8)]"
            >
              {t('boot.init')}
            </motion.p>
            
            <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mt-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full bg-primary shadow-[0_0_10px_rgba(204,255,0,0.8)]"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
