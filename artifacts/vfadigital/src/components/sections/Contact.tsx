import { Github, Facebook, Instagram } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { useGetSettings } from "@workspace/api-client-react";
import { motion } from "framer-motion";

function openChatWidget() {
  window.dispatchEvent(new CustomEvent("vfa:open-chat"));
  setTimeout(() => {
    document.getElementById("vfa-chat-anchor")?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, 100);
}

export function Contact() {
  const { data: settings } = useGetSettings();

  return (
    <section id="contact" className="py-24 border-t border-white/10" style={{ background: "rgba(0,0,0,0.25)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
          Establecer <span className="text-primary">Conexión</span>
        </h2>
        <p className="text-muted-foreground font-body mb-12 max-w-md">
          Hablemos de tu proyecto. El primer mensaje lo respondés en menos de 1 hora.
        </p>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {/* WhatsApp → abre chat interno */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={openChatWidget}
            className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/20 bg-[#1A1A1A] text-white transition-all duration-300 hover:bg-green-600 hover:border-green-600 active:bg-green-600 active:border-green-600 group"
          >
            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-display tracking-wider font-bold">WhatsApp</span>
          </motion.button>

          <motion.a
            whileTap={{ scale: 0.96 }}
            href={settings?.contact.facebook || "https://www.facebook.com/vfadigital"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/20 bg-[#1A1A1A] text-white transition-all duration-300 hover:bg-blue-600 hover:border-blue-600 active:bg-blue-600 active:border-blue-600 group"
          >
            <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-display tracking-wider font-bold">Facebook</span>
          </motion.a>

          <motion.a
            whileTap={{ scale: 0.96 }}
            href={settings?.contact.instagram || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/20 bg-[#1A1A1A] text-white transition-all duration-300 hover:bg-pink-600 hover:border-pink-600 active:bg-pink-600 active:border-pink-600 group"
          >
            <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-display tracking-wider font-bold">Instagram</span>
          </motion.a>

          <motion.a
            whileTap={{ scale: 0.96 }}
            href={settings?.contact.github || "https://github.com/victorfernandoac77-a11y"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/20 bg-[#1A1A1A] text-white transition-all duration-300 hover:bg-white hover:text-black hover:border-white active:bg-white active:text-black active:border-white group"
          >
            <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-display tracking-wider font-bold">GitHub</span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
