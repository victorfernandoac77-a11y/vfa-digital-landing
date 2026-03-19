import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();

const frontendDist = path.join(__dirname, "../../vfadigital/dist/public");
app.use(express.static(frontendDist));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.get("/{*path}", (_req, res) => res.sendFile(path.join(frontendDist, "index.html")));
export default app;
