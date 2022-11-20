const express = require("express");
const port = process.env.PORT || 8080;
const path = require("path");

const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirPath = path.join(__dirname, "../public");

app.use(express.static(publicDirPath));

io.on("connection", (socket) => {
  console.log("web Socket connection!");

  socket.on("join", ({ username, room }) => {
    socket.join(room);

    socket.emit("message", generateMessage("Welcome!"));
    socket.broadcast
      .to(room)
      .emit("message", generateMessage(`${username} has Joined`));
  });
  socket.on("sendMessage", (message, cb) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return cb("Profanity is not allowed");
    }
    io.to("room1").emit("message", generateMessage(message));
    cb();
  });
  socket.on("disconnect", () => {
    io.emit("message", generateMessage("User Has Left!"));
  });
  socket.on("sendLocation", (coords, cb) => {
    io.emit(
      "locationMessage",
      generateLocationMessage(
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
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
