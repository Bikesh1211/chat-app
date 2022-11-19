const express = require("express");
const port = process.env.PORT || 8080;
const path = require("path");

const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirPath = path.join(__dirname, "../public");

app.use(express.static(publicDirPath));

io.on("connection", (socket) => {
  console.log("web Socket connection!");

  socket.emit("message", "Welcome");
  socket.broadcast.emit("message", "a new user joined");

  socket.on("sendMessage", (message, cb) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return cb("Profanity is not allowed");
    }
    io.emit("message", message);
    cb();
  });
  socket.on("disconnect", () => {
    io.emit("message", "a user has left");
  });
  socket.on("sendLocation", (coords, cb) => {
    io.emit(
      "message",
      `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
    );
    cb();
  });
});

app.get("/", (req, res) => {
  res.send("Hello Server ");
});

server.listen(port, () => {
  console.log("Server Is Running on " + "http://localhost:" + port);
});
