const express = require("express");
const nunjucks = require("nunjucks");
var path = require("path");
var roomFunctions = require("./room/");
var userFunctions = require("./user/");
var chatFunctions = require("./chat/");
var database = require("./db");

var router = express.Router();
require("dotenv").config();

database.initDB();

var SpotifyWebApi = require("spotify-web-api-node");

var scopes = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private",
  "streaming",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-modify-playback-state",
  "user-read-playback-state",
  "user-top-read"
];

app = express();
app
  .use(express.static(path.join(__dirname, "/static")))
  .get("/", function(request, response) {
    var code = request.query.code || null;
    response.render("chat.html");
    io.emit("je moeder", {});
  })
  .get("/callback", function(request, response) {
    var code = request.query.code || null;
    console.log(request.socket);
    request.socket.emit("je moeder", { bla: "test" });
    // spotifyApi.authorizationCodeGrant(code).then(function(data) {
    //   console.log("The token expires in " + data.body["expires_in"]);
    //   console.log("The access token is " + data.body["access_token"]);
    //   console.log("The refresh token is " + data.body["refresh_token"]);

    //   // Set the access token on the API object to use it in later calls
    //   spotifyApi.setAccessToken(data.body["access_token"]);
    //   spotifyApi.setRefreshToken(data.body["refresh_token"]);

    // Retrieval of current state
    //   spotifyApi.getMyCurrentPlaybackState({}).then(
    //     function(data) {
    //       // Output items
    //       console.log("Now Playing: ", data.body);
    //     },
    //     function(err) {
    //       console.log("Something went wrong!", err);
    //     }
    //   );
    response.render("redirect.html");
    //   spotifyApi
    //     .createPlaylist("mr_vanderwal", "My Cool Playlist", { public: true })
    //     .then(
    //       function(data) {
    //         console.log("Created playlist!");
    //       },
    //       function(err) {
    //         console.log("Something went wrong!", err);
    //       }
    //     );
    // });
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
  socket.room = "test";
  socket.user = "temp";
  userFunctions.checkLocalStorage(socket);
  var spotifyApi = new SpotifyWebApi({
    clientId: "df21ea498dc949f3b44488f35c52a0f0",
    clientSecret: "1290da6c919f4e18b69b65dc28e8afc4",
    redirectUri: "http://localhost:3000/callback"
  });

  var authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  console.log(authorizeURL);
  socket.on("je moeder", function() {
    console.log("testIngASK");
  });
  socket.on("disconnect", function() {
    console.log("disc");
    roomFunctions.leaveRoom(io, socket, socket.user, socket.room);
  });

  socket.on("je moeder", function(data) {
    console.log("skrill");
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

  socket.on("logged in", function(data) {
    roomFunctions.joinRoom(io, socket, data.user, "General");
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
