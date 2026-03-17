import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { useTranslation } from "@/hooks/use-translations";
import { useSendChatMessage } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ChatMsg = { role: "user" | "model", content: string };

export function AIChat() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"form" | "chat">("form");
  
  // User Data
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  
  // Chat State
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<ChatMsg[]>([
    { role: "model", content: "¡Hola! Soy el asistente VFA. ¿En qué te puedo ayudar hoy?" }
  ]);
  
  const chatMutation = useSendChatMessage();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) setStep("chat");
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;

    const userMsg: ChatMsg = { role: "user", content: input };
    setHistory(prev => [...prev, userMsg]);
    setInput("");

    chatMutation.mutate({
      data: {
        name,
        phone,
        message: input,
        history
      }
    }, {
      onSuccess: (res) => {
        setHistory(prev => [...prev, { role: "model", content: res.reply }]);
      },
      onError: () => {
        setHistory(prev => [...prev, { role: "model", content: "Hubo un error de conexión con mis sistemas. Por favor, intentá nuevamente." }]);
      }
    });
  };

  const handleCloseAndSend = () => {
    const summaryText = history.map(h => `${h.role === 'model' ? 'VFA' : name}: ${h.content}`).join('\n');
    const encoded = encodeURIComponent(`Hola VFADigital, estuve hablando con su IA:\n\n${summaryText}`);
    window.open(`https://wa.me/5491166813990?text=${encoded}`, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Search Popup Fallback Trigger (Invisible, used programmatically if needed) */}
      
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <AnimatePresence>
          {!isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-[#1A1A1A] text-xs font-body px-3 py-1.5 rounded-full border border-primary/30 text-white shadow-lg"
            >
              {t("chat.badge")}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all ${
            isOpen ? "bg-[#1A1A1A] border border-white/10" : "bg-primary text-black"
          }`}
        >
          {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageSquare className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[380px] h-[500px] glass-panel rounded-3xl overflow-hidden flex flex-col z-50 border-primary/20"
          >
            {/* Header */}
            <div className="bg-black/50 border-b border-white/5 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-display font-bold text-white text-lg leading-none">VFA Assistant</h4>
                <p className="text-xs text-primary font-body flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Sistemas Online
                </p>
              </div>
            </div>

            {step === "form" ? (
              <form onSubmit={handleStart} className="flex-1 p-6 flex flex-col gap-4 justify-center">
                <p className="text-sm text-muted-foreground font-body text-center mb-4">
                  Para brindarte una mejor atención, necesitamos un par de datos.
                </p>
                <Input 
                  placeholder="Tu Nombre" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                />
                <Input 
                  placeholder="Teléfono (Opcional)" 
                  type="tel"
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                />
                <Button type="submit" className="mt-4 w-full">Iniciar Conexión</Button>
              </form>
            ) : (
              <>
                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">
                  {history.map((msg, i) => (
                    <div key={i} className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                      <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center ${msg.role === 'user' ? 'bg-[#2A2A2A]' : 'bg-primary/20 text-primary'}`}>
                        {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`p-3 rounded-2xl text-sm font-body ${
                        msg.role === 'user' 
                          ? 'bg-primary text-black rounded-tr-sm' 
                          : 'bg-[#1A1A1A] border border-white/5 text-white rounded-tl-sm'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {chatMutation.isPending && (
                    <div className="self-start flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                         <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="p-3 rounded-2xl bg-[#1A1A1A] rounded-tl-sm flex gap-1 items-center">
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 bg-black/50 border-t border-white/5 flex flex-col gap-2">
                  <form onSubmit={handleSend} className="relative">
                    <Input 
                      placeholder="Escribir mensaje..." 
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      className="pr-12 bg-black border-white/10"
                    />
                    <button 
                      type="submit" 
                      disabled={!input.trim() || chatMutation.isPending}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-primary disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                  <Button variant="outline" size="sm" onClick={handleCloseAndSend} className="w-full text-xs h-8">
                    Cerrar y enviar a WhatsApp
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
