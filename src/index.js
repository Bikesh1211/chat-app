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
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirPath = path.join(__dirname, "../public");

app.use(express.static(publicDirPath));

io.on("connection", (socket) => {
  console.log("web Socket connection!");

  socket.on("join", (options, cb) => {
    const { error, user } = addUser({ id: socket.id, ...options });

    if (error) {
      return cb(error);
    }

    socket.join(user.room);

    socket.emit("message", generateMessage("Admin", "Welcome!"));
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage("Admin", `${user.username} has Joined`));
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    cb();
  });
  socket.on("sendMessage", (message, cb) => {
    const user = getUser(socket.id);

    const filter = new Filter();
    if (filter.isProfane(message)) {
      return cb("Profanity is not allowed");
    }
    io.to(user?.room).emit("message", generateMessage(user?.username, message));
    cb();
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage("Admin ", `${user.username} has Disconnected`)
      );
    }

    io.to(user?.room).emit("roomData", {
      room: user?.room,
      users: getUsersInRoom(user?.room),
    });
  });
  socket.on("sendLocation", (coords, cb) => {
    const user = getUser(socket.id);

    io.to(user.room).emit(
      "locationMessage",
      generateLocationMessage(
        user.username,
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
