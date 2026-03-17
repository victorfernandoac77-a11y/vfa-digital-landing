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
    res.status(500).json({ error: "Servicio de IA no configurado." });
    return;
  }

  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `Sos VFA Assistant, el asistente virtual de VFADigital, una agencia de desarrollo web con sede en Argentina.
Tu objetivo es asesorar a los potenciales clientes sobre los servicios de la agencia y guiarlos hacia una contratación.
Los servicios son:
- Sitio Estático: $60.000 - $120.000 ARS
- Sitio Dinámico: $90.000 - $160.000 ARS  
- Smart IA 3D: $180.000 - $250.000 ARS

Siempre respondé en el idioma del cliente. Sé amable, profesional y conciso.
El cliente se llama ${name}${phone ? ` y su teléfono es ${phone}` : ""}.
Al finalizar la conversación, mencioná que se puede continuar por WhatsApp al +5491166813990.`,
    });

    const chatHistory =
      history?.map((h: { role: string; content: string }) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.content }],
      })) || [];

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    const fullHistory = [
      ...(history || []),
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
  } catch (err) {
    console.error("[VFA Chat Error]", err);
    res.status(500).json({
      error:
        "Error al procesar tu consulta. Por favor intentá de nuevo en unos instantes.",
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
