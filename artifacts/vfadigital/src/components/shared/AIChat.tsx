import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, ExternalLink } from "lucide-react";
import { useTranslation } from "@/hooks/use-translations";
import { useSendChatMessage } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ChatMsg = { role: "user" | "model"; content: string };
type CloseBtnState = "idle" | "success";

const WA_NUMBER = "5491166813990";
const FB_URL = "https://www.facebook.com/vfadigital";

export function AIChat() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"form" | "chat" | "finish">("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [input, setInput] = useState("");
  const [waBtnState, setWaBtnState] = useState<CloseBtnState>("idle");
  const [fbBtnState, setFbBtnState] = useState<CloseBtnState>("idle");
  const [chatBobble, setChatBobble] = useState(true);
  const [history, setHistory] = useState<ChatMsg[]>([]);

  const chatMutation = useSendChatMessage();
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Escuchar evento global para abrir desde otros componentes */
  useEffect(() => {
    const handler = () => { setIsOpen(true); };
    window.addEventListener("vfa:open-chat", handler);
    return () => window.removeEventListener("vfa:open-chat", handler);
  }, []);

  /* Ocultar bobble después de 5s */
  useEffect(() => {
    const t = setTimeout(() => setChatBobble(false), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStep("chat");
    /* Primer mensaje automático de la IA */
    setHistory([{
      role: "model",
      content: "¡Hola! Soy el asistente virtual de Fer en VFA Digital. Él me entrenó para ayudarte rápido mientras se desocupa. ¿De qué trata tu emprendimiento?"
    }]);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;
    const userMsg: ChatMsg = { role: "user", content: input };
    const currentInput = input;
    setHistory(prev => [...prev, userMsg]);
    setInput("");
    chatMutation.mutate(
      { data: { name, phone, message: currentInput, history } },
      {
        onSuccess: (res) => {
          setHistory(prev => [...prev, { role: "model", content: res.reply }]);
        },
        onError: () => {
          setHistory(prev => [
            ...prev,
            { role: "model", content: "No pude procesar eso ahora. ¿Querés intentarlo de nuevo?" }
          ]);
        },
      }
    );
  };

  const buildSummary = () => {
    return history.map(h => `${h.role === "model" ? "VFA" : name}: ${h.content}`).join("\n");
  };

  const handleWA = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (waBtnState === "success") return;
    setWaBtnState("success");
    setTimeout(() => {
      const encoded = encodeURIComponent(
        `Hola Fer, estuve chateando con tu asistente IA:\n\n${buildSummary()}`
      );
      window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, "_blank");
      setWaBtnState("idle");
      setIsOpen(false);
    }, 1500);
  };

  const handleMessenger = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (fbBtnState === "success") return;
    setFbBtnState("success");
    setTimeout(() => {
      window.open(FB_URL, "_blank");
      setFbBtnState("idle");
      setIsOpen(false);
    }, 1500);
  };

  const chatIcon3DStyle = {
    animation: "chatBobble 2.5s ease-in-out infinite",
  };

  return (
    <>
      {/* Anchor invisible para scroll */}
      <div id="vfa-chat-anchor" className="fixed bottom-0 right-0 pointer-events-none" />

      {/* FAB — posicionado al 75% vertical en móvil */}
      <div
        className="fixed right-4 z-[9999] flex flex-col items-end gap-2"
        style={{ bottom: "22vh" }}
      >
        <AnimatePresence>
          {chatBobble && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-[#1A1A1A] text-xs font-body px-3 py-2 rounded-full border border-primary/40 text-white shadow-lg max-w-[160px] text-center leading-snug"
            >
              {t("chat.badge")}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          style={chatIcon3DStyle}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(v => !v)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-[0_0_24px_rgba(204,255,0,0.45)] ${
            isOpen ? "bg-[#1A1A1A] border border-white/20" : "bg-primary text-black"
          }`}
          aria-label="Abrir chat"
        >
          {isOpen
            ? <X className="w-6 h-6 text-white" />
            : <MessageSquare className="w-6 h-6" />
          }
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed right-4 w-[calc(100vw-32px)] sm:w-[380px] glass-panel rounded-3xl overflow-hidden flex flex-col z-[9998] border-primary/20 shadow-[0_0_40px_rgba(204,255,0,0.1)]"
            style={{ bottom: "calc(22vh + 68px)", maxHeight: "min(520px, 70vh)" }}
          >
            {/* Header */}
            <div className="bg-black/60 border-b border-white/5 p-4 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-display font-bold text-white text-base leading-none">VFA Assistant</h4>
                <p className="text-xs text-primary font-body flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Sistemas Online
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="ml-auto text-muted-foreground hover:text-white transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: Formulario obligatorio */}
            {step === "form" && (
              <form onSubmit={handleStart} className="flex-1 p-6 flex flex-col gap-4 justify-center overflow-y-auto">
                <p className="text-sm text-center text-white/70 font-body mb-2">
                  Para brindarte una mejor atención, Fer necesita saber con quién habla.
                </p>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground font-body">Nombre *</label>
                  <Input
                    placeholder="Tu nombre"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground font-body">Teléfono (opcional)</label>
                  <Input
                    placeholder="Ej: +54 11 1234-5678"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
                <Button type="submit" className="mt-2 w-full rounded-[50px]">
                  Iniciar Conexión →
                </Button>
              </form>
            )}

            {/* STEP 2: Chat */}
            {step === "chat" && (
              <>
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                  {history.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "model" && (
                        <div className="w-7 h-7 rounded-full bg-primary/20 flex shrink-0 items-center justify-center self-end">
                          <Bot className="w-3.5 h-3.5 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl text-sm font-body leading-relaxed ${
                          msg.role === "user"
                            ? "bg-primary text-black rounded-tr-sm"
                            : "bg-[#1A1A1A] border border-white/5 text-white rounded-tl-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                      {msg.role === "user" && (
                        <div className="w-7 h-7 rounded-full bg-[#2A2A2A] flex shrink-0 items-center justify-center self-end">
                          <User className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  {chatMutation.isPending && (
                    <div className="flex gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="p-3 rounded-2xl bg-[#1A1A1A] rounded-tl-sm flex gap-1 items-center">
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.15s]" />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.3s]" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="shrink-0 p-3 bg-black/60 border-t border-white/5 flex flex-col gap-2">
                  <form onSubmit={handleSend} className="relative flex gap-2">
                    <Input
                      placeholder="Escribí tu consulta..."
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      className="flex-1 bg-black border-white/10 text-sm pr-2"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || chatMutation.isPending}
                      className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-black disabled:opacity-40 shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                  <button
                    onClick={() => setStep("finish")}
                    className="text-xs text-muted-foreground hover:text-white transition-colors text-center"
                  >
                    Finalizar y enviar resumen →
                  </button>
                </div>
              </>
            )}

            {/* STEP 3: Botones finales con micro-feedback */}
            {step === "finish" && (
              <div className="flex-1 p-6 flex flex-col gap-4 justify-center items-center">
                <Bot className="w-12 h-12 text-primary mb-2" />
                <p className="text-center text-white font-body text-sm leading-relaxed">
                  ¡Fue un gusto charlar, <strong>{name}</strong>! ¿Cómo querés enviarle el resumen de nuestra charla a Fer?
                </p>

                {/* WhatsApp */}
                <button
                  onClick={handleWA}
                  disabled={waBtnState === "success"}
                  className="w-full py-3 rounded-[50px] font-display font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: waBtnState === "success" ? "#00FF00" : "#25D366",
                    color: "black",
                  }}
                >
                  {waBtnState === "success" ? (
                    "✔️ Conexión segura establecida... Redirigiendo"
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Enviar resumen por WhatsApp
                    </>
                  )}
                </button>

                {/* Messenger */}
                <button
                  onClick={handleMessenger}
                  disabled={fbBtnState === "success"}
                  className="w-full py-3 rounded-[50px] font-display font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: fbBtnState === "success" ? "#00FF00" : "#0084FF",
                    color: "white",
                  }}
                >
                  {fbBtnState === "success" ? (
                    <span className="text-black">✔️ Conexión segura establecida... Redirigiendo</span>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Enviar por Messenger
                    </>
                  )}
                </button>

                <button
                  onClick={() => setStep("chat")}
                  className="text-xs text-muted-foreground hover:text-white transition-colors mt-2"
                >
                  ← Volver al chat
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes chatBobble {
          0%   { transform: perspective(300px) rotateY(0deg) scale(1); }
          25%  { transform: perspective(300px) rotateY(15deg) rotateX(8deg) scale(1.08); }
          50%  { transform: perspective(300px) rotateY(-10deg) rotateX(-5deg) scale(1.04); }
          75%  { transform: perspective(300px) rotateY(8deg) rotateX(4deg) scale(1.06); }
          100% { transform: perspective(300px) rotateY(0deg) scale(1); }
        }
      `}</style>
    </>
  );
}
