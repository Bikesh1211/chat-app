const express = require("express");
const port = process.env.PORT || 3001;
const path = require("path");

const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirPath = path.join(__dirname, "../public");

app.use(express.static(publicDirPath));

io.on("connection", (socket) => {
  console.log("web Socket connection!");

  socket.emit("message", "Welcome");

  socket.on("sendMessage", (message) => {
    io.emit("message", message);
  });
});

app.get("/", (req, res) => {
  res.send("Hello Server ");
});

server.listen(port, () => {
  console.log("Server Is Running on " + "http://localhost:" + port);
});
