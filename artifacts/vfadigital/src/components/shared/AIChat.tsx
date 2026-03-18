import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Bot, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/* Chat simplificado:
   1. El usuario escribe su consulta directamente
   2. Elige a dónde enviarla: WhatsApp o Facebook
   3. El mensaje enviado incluye solo la consulta del usuario
*/

const WA_NUMBER = "5491166813990";
const FB_URL = "https://www.facebook.com/vfadigital";
type BtnState = "idle" | "loading";

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [waBtnState, setWaBtnState] = useState<BtnState>("idle");
  const [fbBtnState, setFbBtnState] = useState<BtnState>("idle");
  const [chatBobble, setChatBobble] = useState(true);
  const [sent, setSent] = useState(false);

  /* Abrir desde otros componentes vía evento global */
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("vfa:open-chat", handler);
    return () => window.removeEventListener("vfa:open-chat", handler);
  }, []);

  /* Ocultar burbuja de texto después de 6s */
  useEffect(() => {
    const t = setTimeout(() => setChatBobble(false), 6000);
    return () => clearTimeout(t);
  }, []);

  /* Resetear al cerrar */
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setQuery("");
      setWaBtnState("idle");
      setFbBtnState("idle");
      setSent(false);
    }, 400);
  };

  const buildMsg = () =>
    `Hola Fer! Te escribo desde tu web VFADigital con esta consulta:\n\n${query.trim()}`;

  const handleWA = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!query.trim() || waBtnState === "loading") return;
    setWaBtnState("loading");
    setSent(true);
    setTimeout(() => {
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildMsg())}`, "_blank");
      setWaBtnState("idle");
      handleClose();
    }, 1500);
  };

  const handleFB = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!query.trim() || fbBtnState === "loading") return;
    setFbBtnState("loading");
    setSent(true);
    setTimeout(() => {
      window.open(FB_URL, "_blank");
      setFbBtnState("idle");
      handleClose();
    }, 1500);
  };

  return (
    <>
      <div id="vfa-chat-anchor" className="fixed bottom-0 right-0 pointer-events-none" />

      {/* FAB */}
      <div className="fixed right-4 z-[9999] flex flex-col items-end gap-2" style={{ bottom: "22vh" }}>
        <AnimatePresence>
          {chatBobble && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="bg-[#111] text-xs font-body px-3 py-2 rounded-full border border-primary/40 text-white shadow-xl max-w-[150px] text-center leading-snug"
            >
              ¡Chateá con Fer ahora!
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => (isOpen ? handleClose() : setIsOpen(true))}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-[0_0_24px_rgba(204,255,0,0.5)] ${
            isOpen ? "bg-[#1A1A1A] border border-white/20" : "bg-primary text-black"
          }`}
          style={{ animation: isOpen ? "none" : "chatBobble 2.5s ease-in-out infinite" }}
          aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
        >
          {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageSquare className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Panel de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="fixed right-4 w-[calc(100vw-32px)] sm:w-[360px] glass-panel rounded-3xl overflow-hidden flex flex-col z-[9998] border-primary/20 shadow-[0_0_40px_rgba(204,255,0,0.12)]"
            style={{ bottom: "calc(22vh + 68px)", maxHeight: "min(480px, 72vh)" }}
          >
            {/* Header */}
            <div className="bg-black/60 border-b border-white/5 p-4 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-display font-bold text-white text-base leading-none">VFA Assistant</h4>
                <p className="text-xs text-primary font-body flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Online — Fer responde en &lt;1h
                </p>
              </div>
              <button onClick={handleClose} className="ml-auto text-muted-foreground hover:text-white transition-colors" aria-label="Cerrar">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 flex flex-col gap-4 p-5 overflow-y-auto">
              <p className="text-sm text-white/70 font-body leading-relaxed">
                Escribí tu consulta y elegís si la mandamos por <strong className="text-primary">WhatsApp</strong> o por <strong className="text-[#0084FF]">Messenger</strong>. Fer la recibe al instante.
              </p>

              <Textarea
                placeholder="¿Qué necesitás? Ej: Quiero una web para mi negocio de...\n¿Cuánto sale una landing rápida?"
                value={query}
                onChange={e => setQuery(e.target.value)}
                rows={5}
                className="resize-none bg-black/60 border-white/10 text-sm text-white font-body placeholder:text-white/30 focus:border-primary/50 rounded-xl"
                autoFocus
                disabled={sent}
              />

              {/* Botón WhatsApp */}
              <button
                onClick={handleWA}
                disabled={!query.trim() || waBtnState === "loading" || sent}
                className="w-full py-3 rounded-[50px] font-display font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40"
                style={{
                  backgroundColor: waBtnState === "loading" ? "#00FF00" : "#25D366",
                  color: "black",
                }}
              >
                {waBtnState === "loading" ? (
                  "✔️ Conexión segura establecida... Redirigiendo"
                ) : (
                  <><ExternalLink className="w-4 h-4" /> Enviar por WhatsApp</>
                )}
              </button>

              {/* Botón Messenger */}
              <button
                onClick={handleFB}
                disabled={!query.trim() || fbBtnState === "loading" || sent}
                className="w-full py-3 rounded-[50px] font-display font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40"
                style={{
                  backgroundColor: fbBtnState === "loading" ? "#00FF00" : "#0084FF",
                  color: fbBtnState === "loading" ? "black" : "white",
                }}
              >
                {fbBtnState === "loading" ? (
                  <span className="text-black">✔️ Conexión segura establecida... Redirigiendo</span>
                ) : (
                  <><ExternalLink className="w-4 h-4" /> Enviar por Messenger</>
                )}
              </button>

              {sent && (
                <p className="text-center text-xs text-primary/70 font-body animate-pulse">
                  Abriendo conexión segura...
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes chatBobble {
          0%   { transform: perspective(300px) rotateY(0deg) scale(1); }
          25%  { transform: perspective(300px) rotateY(16deg) rotateX(8deg) scale(1.1); }
          50%  { transform: perspective(300px) rotateY(-10deg) rotateX(-5deg) scale(1.05); }
          75%  { transform: perspective(300px) rotateY(8deg) rotateX(4deg) scale(1.07); }
          100% { transform: perspective(300px) rotateY(0deg) scale(1); }
        }
      `}</style>
    </>
  );
}
