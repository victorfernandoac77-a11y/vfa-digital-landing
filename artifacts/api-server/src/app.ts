import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";

const app: Express = express();
import path from 'path';
const frontendDist = path.join(__dirname, '../../vfadigital/dist');
app.use(express.static(frontendDist));
app.get('*', (_req, res) => res.sendFile(path.join(frontendDist, 'index.html')));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
