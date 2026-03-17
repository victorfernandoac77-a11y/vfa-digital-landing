import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useGetLocale } from "@workspace/api-client-react";

type Language = "es" | "en" | "pt" | "it" | "fr";

interface TranslationContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

// Fallback dictionary in case API is down or loading
const fallback: Record<string, string> = {
  "boot.init": "Iniciando sistemas VFA...",
  "nav.services": "Servicios",
  "nav.portfolio": "Portfolio",
  "nav.authority": "Autoridad",
  "nav.contact": "Contacto",
  "hero.title1": "¡Manejá mejor tu emprendimiento!",
  "hero.title2": "El tiempo es tuyo",
  "hero.title3": "Integrá automatización IA para actuar de asistente en tu web",
  "hero.cta1": "Manejá mejor tu emprendimiento",
  "hero.cta2": "El tiempo es tuyo",
  "hero.cta3": "Integrá asistente IA",
  "stats.projects": "Proyectos",
  "stats.clients": "Clientes",
  "stats.experience": "Años Exp.",
  "services.title": "Nuestros Sistemas",
  "services.static": "Estático",
  "services.dynamic": "Dinámico",
  "services.smart": "Smart IA 3D",
  "transparency.banner": "🛡️ Transparencia VFA: Los valores corresponden a diseño y desarrollo. Costos de Hosting y Dominio corren por cuenta del cliente. Optimizamos para plataformas gratuitas de alta calidad, manteniéndote operativo sin costos fijos obligatorios.",
  "portfolio.title": "Archivos Desclasificados",
  "authority.title": "Protocolos de Seguridad & UX",
  "authority.btn": "Ver Credencial Google UX",
  "chat.badge": "Respondemos en menos de 1 hora",
  "chat.no_results": "¿No encontraste lo que buscás? ¡Consultá con nuestra IA!",
  "footer.motto": "La seguridad de lo que necesitas al alcance de un click"
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem("vfa_lang") as Language) || "es";
  });

  const { data: localeData } = useGetLocale(lang);

  useEffect(() => {
    localStorage.setItem("vfa_lang", lang);
  }, [lang]);

  const t = (key: string): string => {
    if (localeData && typeof localeData === 'object' && key in localeData) {
      return (localeData as Record<string, string>)[key];
    }
    return fallback[key] || key;
  };

  return (
    <TranslationContext.Provider value={{ lang, setLang, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within TranslationProvider");
  }
  return context;
}
