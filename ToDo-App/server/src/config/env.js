// server/src/config/env.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Absoluten Pfad zur .env bestimmen (eine Ebene über src/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env liegt im Ordner server/.env
dotenv.config({ path: path.join(__dirname, "../../.env") });

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN ?? "*",

  vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
  vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
  vapidSubject: process.env.VAPID_SUBJECT,
};
