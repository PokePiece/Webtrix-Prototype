const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const players = {};

io.on("connection", (socket) => {
  socket.on("join", ({ id, position }) => {
    players[socket.id] = { id, position };
    socket.broadcast.emit("player-joined", { id, position });
    socket.emit("init-players", players);
  });

  socket.on("move", ({ id, position }) => {
    if (players[socket.id]) {
      players[socket.id].position = position;
      socket.broadcast.emit("player-moved", { id, position });
    }
  });

  socket.on("disconnect", () => {
    const id = players[socket.id]?.id;
    delete players[socket.id];
    io.emit("player-left", { id });
  });
});

server.listen(3003, () => console.log("Socket.IO server running on port 3003"));
