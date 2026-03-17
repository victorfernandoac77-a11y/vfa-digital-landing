import { Github, Facebook, Instagram, Phone } from "lucide-react";
import { useGetSettings } from "@workspace/api-client-react";

export function Contact() {
  const { data: settings } = useGetSettings();

  const links = [
    { icon: Phone, label: "WhatsApp", url: `https://wa.me/${settings?.contact.whatsapp || '5491166813990'}`, color: "hover:bg-green-500 hover:border-green-500" },
    { icon: Facebook, label: "Facebook", url: settings?.contact.facebook || "#", color: "hover:bg-blue-600 hover:border-blue-600" },
    { icon: Instagram, label: "Instagram", url: settings?.contact.instagram || "#", color: "hover:bg-pink-600 hover:border-pink-600" },
    { icon: Github, label: "GitHub", url: settings?.contact.github || "https://github.com/victorfernandoac77-a11y", color: "hover:bg-white hover:text-black hover:border-white" }
  ];

  return (
    <section id="contact" className="py-24 border-t border-white/5 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-12">
          Establecer <span className="text-primary">Conexión</span>
        </h2>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <a 
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-6 py-3 rounded-full border border-white/20 bg-[#1A1A1A] text-white transition-all duration-300 group ${link.color}`}
              >
                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-display tracking-wider font-bold">{link.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
