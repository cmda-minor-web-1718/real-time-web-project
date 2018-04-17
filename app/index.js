const express = require("express");
const nunjucks = require("nunjucks");
var path = require("path");
var roomFunctions = require("./room/");
var userFunctions = require("./user/");
var chatFunctions = require("./chat/");
var database = require('./db');

var router = express.Router();
require("dotenv").config();

database.initDB();


var SpotifyWebApi = require("spotify-web-api-node");
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

var scopes = ["user-read-private", "user-read-email"],
  state = "some-state-of-my-choice";
console.log(spotifyApi);

var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

console.log(authorizeURL);

spotifyApi.setAccessToken(
  "BQDu_Cl5GfrzA98E2BFqwy51Ez2ithNgYfJ-OtnziFU8RZMb6BU8bPXp2r_hsZw3glvdrugJAqAS5s-SVSzxI6HIzmV8MQXgk6JHJDeItHP_qJs1ebS01bQu6RILkDdPEBGSBxWwNydSVugdZMXjiSiYZs2Wi_KjzbJr"
);




app = express();
app
  .use(express.static(path.join(__dirname, "/static")))
  .get("/", function(request, response) {
    response.render("chat.html");
  })
  .get("/callback", function(request, response) {
    var code = request.query.code || null;
    console.log(code);
  })
  .get("/register", function(request, response) {
    console.log();
  });

// Configuring the nj path as /templates
nunjucks.configure("templates", {
  autoescape: true,
  express: app
});

const server = app.listen(3000, "0.0.0.0", () =>
  console.log("running! on localhost:3000 ")
);

const io = require("socket.io")(server, {});

io.on("connection", socketConnection);

function socketConnection(socket) {
  userFunctions.checkLocalStorage(socket);
 
  socket.on("disconnect", function() {
    console.log("disc");
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

  socket.on('logged in', function(data){
    roomFunctions.joinRoom(io, socket, data.user, "General")
  })

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
