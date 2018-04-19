const express = require("express");
const googleMaps = require("@google/maps");
const dotenv = require("dotenv").config();
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

// https://scotch.io/tutorials/use-ejs-to-template-your-node-application
app.set('view engine', 'ejs');

// server files in the static folder when '/static' is requested
app.use('/static', express.static('static'));

// google create the client with Api key and show promise
var googleMapsClient = googleMaps.createClient({
  key: dotenv.parsed.DB_PROJECT_API,
  Promise: Promise
});

app.use("/", (req,res) => {
  var response;
  googleMapsClient.geocode({address: '1600 Amphitheatre Parkway, Mountain View, CA'})
  .asPromise()
  .then((response) => {
    var response = response.json.results;
    response.forEach(element => {
      console.log(element.address_components);
      io.emit('location', element.address_components)
    });
  })
  .catch((err) => {
    console.log(err);
  });
  res.render("home", { response });
});

io.on('connection', (socket) => {
  socket.on('location', (location) => {
    googleMapsClient.geocode({ address: `${location}` })
      .asPromise()
      .then((response) => {
        var response = response.json.results;
        response.forEach(element => {
          console.log(element.address_components);
          io.emit('location', element.address_components)
        });
      })
      .catch((err) => {
        console.log(err);
      });
  })
})

app.listen(8080, () => {
  console.log('app is running on localhost:8080, WAHOOO');
});
