import { motion, useScroll } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[9999] shadow-[0_0_10px_rgba(204,255,0,0.8)]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
