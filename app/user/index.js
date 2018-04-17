var roomFunctions = require('../room/');

exports.configureTempUser = function configureTempuser(io, socket, data) {
    socket.user = data.username;
    socket.color = "hsl(" + Math.random() * 360 + ", 100%, 75%)";
    socket.room = "General";
    roomFunctions.joinRoom(io, socket, socket.user, socket.room);
}