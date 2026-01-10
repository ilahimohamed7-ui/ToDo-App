import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import pushRoutes from "./routes/push.routes.js";
import userRoutes from "./routes/users.routes.js";


const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json());

// Health Check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Auth-Routen
app.use("/api/auth", authRoutes);

// Projekt-Routen
app.use("/api/projects", projectRoutes);

// Push-Routen
app.use("/api/push", pushRoutes);

app.use("/api/users", userRoutes);


// Error-Handler MUSS zum Schluss kommen
app.use(errorHandler);

export default app;
