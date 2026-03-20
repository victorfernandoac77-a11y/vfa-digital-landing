/* VFADigital Engine - Core v1.1 */
import { Router, type IRouter, type Request, type Response } from "express";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router: IRouter = Router();
const SETTINGS_PATH = resolve(__dirname, "../config/settings.json");
const LOCALES_PATH = resolve(__dirname, "../locales");

function loadSettings() {
  return JSON.parse(readFileSync(SETTINGS_PATH, "utf-8"));
}

function saveSettings(data: object) {
  writeFileSync(SETTINGS_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function loadLocale(lang: string) {
  const allowed = ["es", "en", "pt", "it", "fr"];
  if (!allowed.includes(lang)) return null;
  return JSON.parse(readFileSync(resolve(LOCALES_PATH, `${lang}.json`), "utf-8"));
}

/* Public settings */
router.get("/settings", (_req: Request, res: Response) => {
  const s = loadSettings();
  res.json({
    contact: s.contact,
    portfolio: s.portfolio,
    stats: s.stats,
    services: s.services,
    authority: s.authority,
    promo: s.promo || "",
  });
});

/* Locales */
router.get("/locales/:lang", (req: Request, res: Response) => {
  const locale = loadLocale(req.params.lang);
  if (!locale) { res.status(404).json({ error: "Locale not found" }); return; }
  res.json(locale);
});

/* AI Chat */
router.post("/chat", async (req: Request, res: Response) => {
  const { name, phone, message, history } = req.body;
  if (!name || !message) {
    res.status(400).json({ error: "Nombre y mensaje son requeridos." }); return;
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[VFA Chat] GEMINI_API_KEY no configurada.");
    res.status(500).json({ error: "Servicio de IA no configurado." }); return;
  }
  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);

    const systemInstruction = `Sos el asistente virtual de Fer en VFA Digital. Él te entrenó para ayudar rápido a sus clientes mientras se desocupa.
Tu primer mensaje siempre debe ser exactamente: "¡Hola! Soy el asistente virtual de Fer en VFA Digital. Él me entrenó para ayudarte rápido mientras se desocupa. ¿De qué trata tu emprendimiento?"

Reglas:
- Respondé siempre en el idioma del cliente.
- Sé cálido, natural, directo. No hables como un robot.
- El cliente se llama ${name}${phone ? ` y su teléfono es ${phone}` : ""}.

Servicios y precios:
- ESTÁTICO: $60.000 - $120.000 ARS | 1 semana. $60k = vidriera digital rápida. $120k = múltiples secciones y animaciones.
- DINÁMICO: $90.000 - $160.000 ARS | 2 semanas. $90k = control de datos base. $160k = catálogos y promociones en tiempo real.
- SMART IA 3D: $180.000 - $250.000 ARS | 3 semanas. $180k = Asistente IA base + fondo 3D. $250k = IA cerrador de ventas experto + 3D a medida.

Oferta gratuita (ofrecela si el cliente menciona que ya tiene una web):
"Si ya tenés una web pero sentís que no te trae clientes, dejame el link y Fer te hace una mini-auditoría visual sin cargo."

Ubicación: VFA Digital opera digitalmente desde Argentina y trabaja con toda Latinoamérica.

Si el cliente quiere contactar a Fer o cerrar el servicio, ofrecé:
1. WhatsApp: https://wa.me/5491166813990
2. Facebook Messenger: https://m.me/982746351596780`;

    const safeHistory = Array.isArray(history) ? history : [];

    const chatHistory = safeHistory
      .filter((h: { role: string; content: string }) => h?.role && h?.content?.trim())
      .map((h: { role: string; content: string }) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.content }],
      }))
      .filter((_: unknown, i: number, arr: { role: string }[]) =>
        !(i === 0 && arr[0].role !== "user")
      );

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction });
    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    const fullHistory = [...safeHistory, { role: "user", content: message }, { role: "model", content: reply }];
    const summaryText = fullHistory.map((h: { role: string; content: string }) =>
      `${h.role === "user" ? name : "VFA"}: ${h.content}`).join("\n");

    res.json({ reply, summary: summaryText });
  } catch (err: unknown) {
    const e = err as Error;
    console.error("[VFA Chat Error]", e?.constructor?.name, e?.message, e?.stack);
    res.status(200).json({ reply: "En este momento hay mucha demanda. Por favor contactá a Fer directamente por WhatsApp: https://wa.me/5491166813990" });
  }
});

/* Admin: verificar contraseña */
router.post("/admin/verify", (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token || typeof token !== "string") {
    res.status(401).json({ error: "Acceso no autorizado." }); return;
  }
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    res.status(500).json({ error: "Config de seguridad no disponible." }); return;
  }
  if (token !== adminPassword) {
    res.status(401).json({ error: "Código incorrecto." }); return;
  }
  res.json({ success: true, data: { settings: loadSettings() } });
});

/* Admin: guardar settings */
router.post("/admin/settings", (req: Request, res: Response) => {
  const { token, contact, services, promo } = req.body;
  if (!token || typeof token !== "string") {
    res.status(401).json({ error: "Acceso no autorizado." }); return;
  }
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || token !== adminPassword) {
    res.status(401).json({ error: "Token inválido." }); return;
  }
  try {
    const current = loadSettings();
    const updated = {
      ...current,
      contact: contact ?? current.contact,
      services: services ?? current.services,
      promo: typeof promo === "string" ? promo : (current.promo || ""),
    };
    saveSettings(updated);
    res.json({ success: true, message: "Settings guardados." });
  } catch (err: unknown) {
    const e = err as Error;
    console.error("[VFA Admin Save Error]", e?.message);
    res.status(500).json({ error: "No se pudo guardar la configuración." });
  }
});

export default router;
