const express = require("express");
const nunjucks = require("nunjucks");
var path = require("path");
var roomFunctions = require("./room/");
var userFunctions = require("./user/");
var chatFunctions = require("./chat/");
const Sequelize = require("sequelize");
var localStorage = require("localStorage");
var router = express.Router();
require("dotenv").config();
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

const sequelize = new Sequelize("rtwp", "postgres", "postgres", {
  host: "localhost",
  dialect: "postgres",
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

const User = sequelize.define("user", {
  userName: {
    type: Sequelize.STRING
  },
  spotifyCode: {
    type: Sequelize.STRING(2550)
  },
  color: {
    type: Sequelize.STRING
  }
});

User.sync({ force: true }).then(() => {
  return User.create({
    userName: "freek",
    spotifyCode:
      "AQCTabvcmmU347eShVcvFFqdFN8MKgr2ep_XBbGZ_JT4t2kyYgXkXz0N0h-VV0l_Se8L8Rqv2w3jCARye1S-2H60szVolTAuWO9m6Pl6T35xNfRxiTtEhupt1qamsrkm2rx46q_rBEPFHHwIec27Ab0X-QoOm3JwFLH-iIIii5r4jUHp5fZznU1QVeiFnl3I2kFUW0lLRaIK6qS1dwvWGF7Kbf0W_kySlBTYXmkKu_xAQsfs6ZuanA",
    color: "#fff"
  });
});

// spotifyApi.getArtistAlbums("43ZHCT0cAZBISjO8DG9PnE").then(
//   function(data) {
//     console.log("Artist albums", data.body);
//   },
//   function(err) {
//     console.error(err);
//   }
// );
app = express();
app
  .use(express.static(path.join(__dirname, "/static")))
  .get("/", function(request, response) {
    User.findOne().then(user => {
      console.log(user.get("userName"));
    });
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

const io = require("socket.io")(server);

io.on("connection", socketConnection);

function socketConnection(socket) {
  console.log(localStorage.getItem("tempUser"));
  if (localStorage.getItem("tempUser")) {
    tempUserData = localStorage.getItem("tempUser");
    console.log(tempUserData);
    userFunctions.configureTempUser(io, socket, tempUserData);
  }
  console.log(socket.id);

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
