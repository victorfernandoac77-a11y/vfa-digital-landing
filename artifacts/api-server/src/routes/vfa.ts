/* VFADigital Engine - Core v1.0 */
import { Router, type IRouter, type Request, type Response } from "express";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router: IRouter = Router();

const SETTINGS_PATH = resolve(__dirname, "../config/settings.json");
const LOCALES_PATH = resolve(__dirname, "../locales");

function loadSettings() {
  const raw = readFileSync(SETTINGS_PATH, "utf-8");
  return JSON.parse(raw);
}

function loadLocale(lang: string) {
  const allowed = ["es", "en", "pt", "it", "fr"];
  if (!allowed.includes(lang)) return null;
  const raw = readFileSync(resolve(LOCALES_PATH, `${lang}.json`), "utf-8");
  return JSON.parse(raw);
}

/* Public settings endpoint */
router.get("/settings", (_req: Request, res: Response) => {
  const settings = loadSettings();
  res.json({
    contact: settings.contact,
    portfolio: settings.portfolio,
    stats: settings.stats,
    services: settings.services,
    authority: settings.authority,
  });
});

/* Locale endpoint */
router.get("/locales/:lang", (req: Request, res: Response) => {
  const { lang } = req.params;
  const locale = loadLocale(lang);
  if (!locale) {
    res.status(404).json({ error: "Locale not found" });
    return;
  }
  res.json(locale);
});

/* AI Chat endpoint */
router.post("/chat", async (req: Request, res: Response) => {
  const { name, phone, message, history } = req.body;

  if (!name || !message) {
    res.status(400).json({ error: "Nombre y mensaje son requeridos." });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("[VFA Chat] GEMINI_API_KEY no está configurada en el entorno.");
    res.status(500).json({ error: "Servicio de IA no configurado." });
    return;
  }

  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);

    const systemInstruction = `Sos el asistente virtual de Fer en VFA Digital. Él te entrenó para ayudar rápido a sus clientes mientras se desocupa.
Tu primer mensaje siempre debe ser exactamente: "¡Hola! Soy el asistente virtual de Fer en VFA Digital. Él me entrenó para ayudarte rápido mientras se desocupa. ¿De qué trata tu emprendimiento?"

Reglas de conversación:
- Respondé siempre en el idioma del cliente.
- Sé cálido, natural, directo y útil. Nunca respondas como un robot.
- El cliente se llama ${name}${phone ? ` y su teléfono es ${phone}` : ""}.

Servicios y precios de VFA Digital (en pesos argentinos):
- ESTÁTICO: $60.000 - $120.000 ARS. Tiempo de desarrollo: 1 semana. $60k cubre tu vidriera digital rápida. Escala a $120k si requieres múltiples secciones y animaciones personalizadas.
- DINÁMICO: $90.000 - $160.000 ARS. Tiempo de desarrollo: 2 semanas. $90k te da control de tus datos base. Escala a $160k si necesitas gestionar catálogos o promociones en tiempo real.
- SMART IA 3D: $180.000 - $250.000 ARS. Tiempo de desarrollo: 3 semanas. $180k incluye tu Asistente IA base y fondo 3D. Escala a $250k al entrenar a tu IA como cerrador de ventas experto con 3D a medida.

Oferta de valor gratuita (ofrecela proactivamente si el cliente menciona que ya tiene una web):
"Si ya tenés una web pero sentís que no te trae clientes, dejame el link y Fer te hace una mini-auditoría visual sin cargo."

Sobre la ubicación: VFA Digital opera digitalmente desde Argentina y trabaja con clientes de toda Latinoamérica.

Si el cliente pregunta dónde contactar directamente a Fer o quiere cerrar el servicio, ofrecele DOS opciones:
1. WhatsApp: https://wa.me/5491166813990 (mensaje sugerido: "Hola Fer, estuve hablando con tu asistente IA y quiero saber más sobre [servicio mencionado]")
2. Facebook Messenger: www.facebook.com/vfadigital (puedes copiar y pegar el mensaje anterior)

Nunca inventes precios, servicios ni plazos que no estén en esta lista. Sé honesto si no sabés algo.`;

    const safeHistory = Array.isArray(history) ? history : [];

    const chatHistory = safeHistory
      .filter((h: { role: string; content: string }) =>
        h && typeof h.role === "string" && typeof h.content === "string" && h.content.trim() !== ""
      )
      .map((h: { role: string; content: string }) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.content }],
      }));

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction,
    });

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    const fullHistory = [
      ...safeHistory,
      { role: "user", content: message },
      { role: "model", content: reply },
    ];
    const summaryText = fullHistory
      .map(
        (h: { role: string; content: string }) =>
          `${h.role === "user" ? name : "VFA"}: ${h.content}`
      )
      .join("\n");

    res.json({ reply, summary: summaryText });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("[VFA Chat Error] Tipo:", error?.constructor?.name);
    console.error("[VFA Chat Error] Mensaje:", error?.message);
    console.error("[VFA Chat Error] Stack:", error?.stack);
    res.status(500).json({
      error: "No pude procesar tu consulta en este momento. Intentá de nuevo en unos instantes.",
    });
  }
});

/* Admin verification endpoint */
router.post("/admin/verify", (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token || typeof token !== "string") {
    res.status(401).json({ error: "Acceso no autorizado." });
    return;
  }

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    res.status(500).json({ error: "Configuración de seguridad no disponible." });
    return;
  }

  if (token !== adminPassword) {
    res.status(401).json({ error: "Código de acceso incorrecto." });
    return;
  }

  const settings = loadSettings();
  res.json({ success: true, data: { settings } });
});

export default router;
