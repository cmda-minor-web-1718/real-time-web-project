var roomFunctions = require("../room/");
var localStorage = require("localStorage");

function storeTempUserData(socket) {
  var tempUser = {
    user: String(socket.user),
    color: socket.color,
    room: socket.room
  };

  localStorage.setItem("tempUser", JSON.stringify(tempUser));
}

exports.configureTempUser = function configureTempuser(io, socket, data) {
  try {
    data = JSON.parse(data);
    console.log("user_data", JSON.parse(data));
  } catch (e) {}
  socket.color = data.color || "hsl(" + Math.random() * 360 + ", 100%, 75%)";
  socket.user = data.user;
  socket.room = data.room || "General";
  storeTempUserData(socket);

  roomFunctions.joinRoom(io, socket, socket.user, socket.room);
  socket.emit("login temp user", {});
};
