const socket = io();
socket.on("message", (msg) => {
  console.log(msg);
});

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message);
});

document.querySelector("#send-location").addEventListener("click", (e) => {
  if (!navigator.geolocation) {
    return alert("Geolocation not available");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit("sendLocation", {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  });
});
