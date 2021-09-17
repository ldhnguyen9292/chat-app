const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { createMessages } = require("./utils/create-messages");
const { getUserList, addUser, removeUser } = require("./utils/users");
const publicPathDirectory = path.join(__dirname, "../public");
const app = express();
const port = 8888;

app.use(express.static(publicPathDirectory));
const server = http.createServer(app);
const io = socketio(server);

// Lắng nghe sự kiện kết nối từ client
io.on("connection", (socket) => {
  // Gửi count đến client
  //   socket.emit("send count", count);
  //   socket.emit("send message", message);

  // Nhận mess từ client
  //   socket.on("increase count", () => {
  //     count++;
  //     io.emit("send count", count);
  //   });

  // join room
  socket.on("join_room_client_to_server", ({ room, username }) => {
    socket.join(room);

    socket.emit(
      "welcome_to_client",
      createMessages(null, `Welcome ${username} to ${room}`)
    );
    // Gửi tin nhắn đến các client khác
    socket.broadcast
      .to(room)
      .emit(
        "welcome_to_client",
        createMessages(null, `${username} vừa tham gia vào ${room}`)
      );

    // chat
    socket.on("send_message_to_server", (message, callback) => {
      const filter = new Filter();
      if (filter.isProfane(message))
        return callback("Tin nhắn có từ khóa tục tỉu");

      io.to(room).emit(
        "send_message_to_client",
        createMessages(username, message)
      );
      callback();
    });

    // Share location
    socket.on("share_location_to_server", ({ latitude, longitude }) => {
      const linkLocation = `https://www.google.com/maps?q=${latitude},${longitude}`;
      io.to(room).emit(
        "send_location_to_client",
        createMessages(username, linkLocation)
      );
    });

    // Send userList
    const newUser = {
      id: socket.id,
      username,
      room,
    };
    addUser(newUser);
    io.to(room).emit("send_userList", getUserList(room));

    // ngắt kết nối
    socket.on("disconnect", () => {
      // remove User
      removeUser(socket.id);
      io.to(room).emit("send_userList", getUserList(room));
    });
  });
});

server.listen(port, console.log(`Connect to server at ${port}`));
