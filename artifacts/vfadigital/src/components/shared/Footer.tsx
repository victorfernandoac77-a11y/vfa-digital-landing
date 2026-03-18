import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/use-translations";
import { Shield, X, Save, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useVerifyAdmin, useGetSettings } from "@workspace/api-client-react";

type AdminStep = "hidden" | "auth" | "panel";

export function Footer() {
  const { t } = useTranslation();
  const { data: settings, refetch } = useGetSettings();
  const [step, setStep] = useState<AdminStep>("hidden");
  const [pwd, setPwd] = useState("");
  const [authError, setAuthError] = useState("");
  const [token, setToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveOk, setSaveOk] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const verifyMutation = useVerifyAdmin();

  /* Formulario admin editable */
  const [form, setForm] = useState({
    whatsapp: "",
    facebook: "",
    instagram: "",
    github: "",
    staticMin: "",
    staticMax: "",
    dynamicMin: "",
    dynamicMax: "",
    smartMin: "",
    smartMax: "",
    promo: "",
  });

  const handlePointerDown = () => {
    timerRef.current = setTimeout(() => setStep("auth"), 5000);
  };
  const handlePointerUp = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const onAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    verifyMutation.mutate(
      { data: { token: pwd } },
      {
        onSuccess: (res) => {
          if (res.success) {
            setToken(pwd);
            /* Prellenar form con datos actuales */
            const s = res.data.settings;
            setForm({
              whatsapp: s.contact?.whatsapp || "",
              facebook: s.contact?.facebook || "",
              instagram: s.contact?.instagram || "",
              github: s.contact?.github || "",
              staticMin: String(s.services?.static?.priceMin || ""),
              staticMax: String(s.services?.static?.priceMax || ""),
              dynamicMin: String(s.services?.dynamic?.priceMin || ""),
              dynamicMax: String(s.services?.dynamic?.priceMax || ""),
              smartMin: String(s.services?.smart?.priceMin || ""),
              smartMax: String(s.services?.smart?.priceMax || ""),
              promo: s.promo || "",
            });
            setPwd("");
            setStep("panel");
          }
        },
        onError: () => {
          setAuthError("Código incorrecto. Intentá de nuevo.");
          setPwd("");
        }
      }
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        token,
        contact: {
          whatsapp: form.whatsapp,
          whatsappLink: `https://wa.me/${form.whatsapp.replace(/\D/g, "")}`,
          facebook: form.facebook,
          instagram: form.instagram,
          github: form.github,
        },
        services: {
          static: { priceMin: Number(form.staticMin), priceMax: Number(form.staticMax), currency: "ARS" },
          dynamic: { priceMin: Number(form.dynamicMin), priceMax: Number(form.dynamicMax), currency: "ARS" },
          smart: { priceMin: Number(form.smartMin), priceMax: Number(form.smartMax), currency: "ARS" },
        },
        promo: form.promo,
      };
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Error al guardar");
      setSaveOk(true);
      refetch();
      setTimeout(() => setSaveOk(false), 3000);
    } catch {
      alert("Error al guardar. Revisá los datos.");
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof typeof form, placeholder = "") => (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-muted-foreground font-body">{label}</label>
      <Input
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="bg-black/60 border-white/10 text-sm text-white"
      />
    </div>
  );

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center gap-6 text-center">
        {/* Trigger oculto: long-press 5s */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onContextMenu={e => e.preventDefault()}
        >
          <Shield className="w-5 h-5 text-primary/50" />
          <span className="font-display font-bold text-xl tracking-widest text-white/80">
            VFA<span className="text-primary/80">Digital</span>
          </span>
        </div>

        <p className="text-muted-foreground font-body text-sm max-w-md">
          {t("footer.motto")}
        </p>
        <p className="text-white/20 text-xs mt-8">
          © {new Date().getFullYear()} VFADigital. Engine v1.0.
        </p>
      </div>

      {/* MODAL AUTH */}
      <AnimatePresence>
        {step === "auth" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 16 }}
              className="glass-panel p-8 rounded-3xl w-full max-w-xs border-primary/30 shadow-[0_0_40px_rgba(204,255,0,0.1)]"
            >
              <h3 className="font-display text-lg text-primary mb-1 text-center tracking-widest">SYSTEM_AUTH</h3>
              <p className="text-xs text-muted-foreground text-center mb-6">Panel de Control VFA</p>
              {authError && (
                <p className="text-red-400 text-xs font-body text-center mb-3">{authError}</p>
              )}
              <form onSubmit={onAuthSubmit} className="flex flex-col gap-4">
                <Input
                  type="password"
                  value={pwd}
                  onChange={e => setPwd(e.target.value)}
                  placeholder="Contraseña de acceso"
                  autoFocus
                  className="text-center tracking-widest"
                />
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" className="flex-1" onClick={() => setStep("hidden")}>
                    ABORT
                  </Button>
                  <Button type="submit" disabled={verifyMutation.isPending || !pwd} className="flex-1">
                    {verifyMutation.isPending ? "..." : "EXEC"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PANEL DE CONTROL ADMIN */}
      <AnimatePresence>
        {step === "panel" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.93, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 20 }}
              className="glass-panel rounded-3xl w-full max-w-lg border-primary/30 shadow-[0_0_50px_rgba(204,255,0,0.1)] overflow-hidden my-4"
            >
              {/* Header Panel */}
              <div className="bg-black/70 border-b border-primary/20 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-primary text-lg tracking-widest">SALA DE MÁQUINAS VFA</h3>
                  <p className="text-xs text-muted-foreground font-body">Panel de Control · Acceso Autorizado</p>
                </div>
                <button
                  onClick={() => setStep("hidden")}
                  className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[70vh]">

                {/* Sección: Redes y Contacto */}
                <div>
                  <h4 className="text-sm font-display font-bold text-primary mb-3 uppercase tracking-widest border-b border-primary/20 pb-2">
                    / Redes y Contacto
                  </h4>
                  <div className="flex flex-col gap-3">
                    {field("WhatsApp (número, ej: +5491166813990)", "whatsapp")}
                    {field("Facebook URL", "facebook", "https://www.facebook.com/...")}
                    {field("Instagram URL", "instagram", "https://www.instagram.com/...")}
                    {field("GitHub URL", "github", "https://github.com/...")}
                  </div>
                </div>

                {/* Sección: Precios */}
                <div>
                  <h4 className="text-sm font-display font-bold text-primary mb-3 uppercase tracking-widest border-b border-primary/20 pb-2">
                    / Precios de Servicios (ARS)
                  </h4>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <div className="flex-1">{field("Estático Mín", "staticMin", "60000")}</div>
                      <div className="flex-1">{field("Estático Máx", "staticMax", "120000")}</div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">{field("Dinámico Mín", "dynamicMin", "90000")}</div>
                      <div className="flex-1">{field("Dinámico Máx", "dynamicMax", "160000")}</div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">{field("Smart IA Mín", "smartMin", "180000")}</div>
                      <div className="flex-1">{field("Smart IA Máx", "smartMax", "250000")}</div>
                    </div>
                  </div>
                </div>

                {/* Sección: Promo */}
                <div>
                  <h4 className="text-sm font-display font-bold text-primary mb-3 uppercase tracking-widest border-b border-primary/20 pb-2">
                    / Texto Promocional
                  </h4>
                  {field("Banner (vacío = oculto)", "promo", "🔥 Promo válida hasta el 23/05")}
                  <p className="text-xs text-muted-foreground font-body mt-1">
                    Si tiene contenido, aparece como banner neón sobre la sección de precios.
                  </p>
                </div>

                {/* Feedback + guardar */}
                <AnimatePresence>
                  {saveOk && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-xl p-3 text-primary font-body text-sm"
                    >
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      ✔️ Sistemas actualizados con éxito
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button onClick={handleSave} disabled={saving} className="w-full rounded-[50px] gap-2">
                  <Save className="w-4 h-4" />
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
