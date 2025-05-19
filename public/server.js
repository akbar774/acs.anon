const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let waitingUser = null;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  if (waitingUser) {
    const room = socket.id + "#" + waitingUser.id;
    socket.join(room);
    waitingUser.join(room);

    socket.partner = waitingUser;
    waitingUser.partner = socket;

    socket.emit("paired", { room });
    waitingUser.emit("paired", { room });

    waitingUser = null;
  } else {
    waitingUser = socket;
    socket.emit("waiting");
  }

  socket.on("message", (msg) => {
    if (socket.partner) socket.partner.emit("message", msg);
  });

  socket.on("signal", (data) => {
    if (socket.partner) socket.partner.emit("signal", data);
  });

  socket.on("skip", () => {
    if (socket.partner) socket.partner.emit("skipped");
    if (socket.partner) socket.partner.partner = null;
    socket.partner = null;
    socket.emit("skipped");
    if (waitingUser === null) {
      waitingUser = socket;
    }
  });

  socket.on("disconnect", () => {
    if (waitingUser === socket) {
      waitingUser = null;
    }
    if (socket.partner) {
      socket.partner.emit("disconnected");
      socket.partner.partner = null;
    }
  });
});

http.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
