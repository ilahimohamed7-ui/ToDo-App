import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { Server } from "socket.io";

const PORT = env.port || 4000;

// Express → HTTP-Server bauen
const server = http.createServer(app);

// Socket.io Server erstellen
const io = new Server(server, {
  cors: {
    origin: env.corsOrigin || "http://localhost:5173",
    credentials: true,
  },
});

// io in Express-App speichern → damit Controller darauf zugreifen können
app.set("io", io);

// Socket.io Events
io.on("connection", (socket) => {
  console.log(" Socket connected:", socket.id);

  // Raum für Projekt beitreten
  socket.on("joinProject", (projectId) => {
    console.log(` ${socket.id} joined project ${projectId}`);
    socket.join(projectId);
  });

  // Raum verlassen
  socket.on("leaveProject", (projectId) => {
    console.log(` ${socket.id} left project ${projectId}`);
    socket.leave(projectId);
  });

  socket.on("disconnect", () => {
    console.log(" Socket disconnected:", socket.id);
  });
});

async function bootstrap() {
  await connectDB();

  server.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
  });
}

bootstrap();
