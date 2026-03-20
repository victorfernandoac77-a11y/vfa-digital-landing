import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Bot, ExternalLink, Send } from "lucide-react";

const WA_NUMBER = "5491166813990";
const FB_URL = "https://m.me/982746351596780";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatBobble, setChatBobble] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"form" | "chat">("form");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("vfa:open-chat", handler);
    return () => window.removeEventListener("vfa:open-chat", handler);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setChatBobble(false), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setMessages([]);
      setInput("");
      setLoading(false);
      setName("");
      setPhone("");
      setStep("form");
    }, 400);
  };

  const handleStartChat = () => {
    if (!name.trim()) return;
    setStep("chat");
    setMessages([{
      role: "assistant",
      content: `¡Hola ${name}! Soy el asistente de VFA Digital. ¿En qué puedo ayudarte hoy?`,
    }]);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          message: userMsg,
          history: newMessages.slice(0, -1),
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.reply ?? "No pude procesar tu consulta. Intentá de nuevo.",
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Error de conexión. Intentá de nuevo.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const buildSummary = () => {
    const lines = messages
      .map(m => `${m.role === "user" ? name : "VFA"}:  ${m.content}`)
      .join("\n");
    return `Hola Fer! Te escribo desde tu web VFADigital.\n\nNombre: ${name}\nTeléfono: ${phone || "no indicado"}\n\nConversación:\n${lines}`;
  };

  const handleWA = () => {
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildSummary())}`, "_blank");
    handleClose();
  };

  const handleFB = () => {
    window.open(FB_URL, "_blank");
    handleClose();
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

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="fixed right-4 w-[calc(100vw-32px)] sm:w-[360px] glass-panel rounded-3xl overflow-hidden flex flex-col z-[9998] border-primary/20 shadow-[0_0_40px_rgba(204,255,0,0.12)]"
            style={{ bottom: "calc(22vh + 68px)", maxHeight: "min(520px, 75vh)" }}
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
                  Online — Fer responde en &lt;breve
                </p>
              </div>
              <button onClick={handleClose} className="ml-auto text-muted-foreground hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 flex flex-col gap-3 p-4 overflow-y-auto">

              {step === "form" ? (
                <>
                  <p className="text-sm text-white/70 font-body">
                    Para empezar, decinos tu nombre:
                  </p>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-body placeholder:text-white/30 focus:border-primary/50 outline-none"
                    onKeyDown={e => e.key === "Enter" && handleStartChat()}
                  />
                  <input
                    type="tel"
                    placeholder="Tu teléfono (opcional)"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-body placeholder:text-white/30 focus:border-primary/50 outline-none"
                    onKeyDown={e => e.key === "Enter" && handleStartChat()}
                  />
                  <button
                    onClick={handleStartChat}
                    disabled={!name.trim()}
                    className="w-full py-3 rounded-[50px] font-display font-bold text-sm bg-primary text-black disabled:opacity-40"
                  >
                    Iniciar chat
                  </button>
                </>
              ) : (
                <>
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm font-body leading-relaxed ${
                        m.role === "user"
                          ? "bg-primary text-black"
                          : "bg-white/10 text-white"
                      }`}>
                        {m.content}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-white/10 px-4 py-2 rounded-2xl text-sm text-white/50 font-body animate-pulse">
                        Escribiendo...
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />

                  {messages.length > 2 && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleWA}
                        className="flex-1 py-2 rounded-[50px] font-display font-bold text-xs flex items-center justify-center gap-1"
                        style={{ backgroundColor: "#25D366", color: "black" }}
                      >
                        <ExternalLink className="w-3 h-3" /> WhatsApp
                      </button>
                      <button
                        onClick={handleFB}
                        className="flex-1 py-2 rounded-[50px] font-display font-bold text-xs flex items-center justify-center gap-1"
                        style={{ backgroundColor: "#0084FF", color: "white" }}
                      >
                        <ExternalLink className="w-3 h-3" /> Messenger
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Input */}
            {step === "chat" && (
              <div className="border-t border-white/5 p-3 flex gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="Escribí tu consulta..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-body placeholder:text-white/30 focus:border-primary/50 outline-none"
                  disabled={loading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
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
