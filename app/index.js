const express = require("express");
const nunjucks = require("nunjucks");
var path = require("path");
var roomFunctions = require("./room/");
var userFunctions = require("./user/");
var chatFunctions = require("./chat/");
var router = express.Router();

app = express();
app
  .use(express.static(path.join(__dirname, "/static")))
  .get("/", function(request, response) {
    response.render("chat.html");
  });

// Configuring the nj path as /templates
nunjucks.configure("templates", {
  autoescape: true,
  express: app
});

const server = app.listen(3000, "0.0.0.0", () =>
  console.log("running! on localhost:3000 ")
);

const io = require("socket.io")(server);

io.on("connection", socketConnection);

function socketConnection(socket) {
  socket.on("disconnect", function() {
    roomFunctions.leaveRoom(io, socket, socket.user, socket.room);
  });

  socket.on("typing", function(data) {
    context = {
      message: "",
      typing: false
    };
    if (data.message === true) {
      context.message = `${socket.user} is typing...`;
      typing: true;
    }
    socket.to(socket.room).emit("typing", context);
  });

  socket.on("login temp user", function(data) {
    userFunctions.configureTempUser(io, socket, data);
  });

  socket.on("new message", function(data) {
    censoredMessage = chatFunctions.censorProfanity(data, socket);
    io.to(socket.room).emit("new message", {
      message: censoredMessage,
      user: socket.user,
      user_color: socket.color
    });
  });

  socket.on("change room", function(data) {
    roomFunctions.leaveRoom(io, socket, socket.user, socket.room);
    socket.room = data.room;
    roomFunctions.joinRoom(io, socket, socket.user, socket.room);
  });
}
