const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const { initSocket } = require("./socket");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const clientRoutes = require("./routes/clientRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const activityRoutes = require("./routes/activityRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const emailRoutes = require("./routes/emailRoutes");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// Socket.io
initSocket(server);

// Middleware global
app.use(cors());
app.use(express.json());
app.use(logger);

// Servir archivos subidos
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/files", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/email", emailRoutes);

// Health
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
  console.log(`WebSocket listo`);
});
