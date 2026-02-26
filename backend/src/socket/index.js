const { Server } = require("socket.io");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:3000"],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`[Socket] Cliente conectado: ${socket.id}`);

    socket.on("join", (userId) => {
      socket.join(`user:${userId}`);
      console.log(`[Socket] Usuario ${userId} en sala`);
    });

    socket.on("disconnect", () => {
      console.log(`[Socket] Cliente desconectado: ${socket.id}`);
    });
  });

  return io;
}

function getIO() {
  if (!io) throw new Error("Socket.io no inicializado");
  return io;
}

function emit(event, data) {
  if (io) io.emit(event, data);
}

module.exports = { initSocket, getIO, emit };
