const express = require("express");
const googleMaps = require("@google/maps");


const app = express();


app.set('view engine', 'ejs');

var googleMapsClient = googleMaps.createClient({
  key: "AIzaSyAVTJ9w1iE5gBXHfGkK0v9ZRKw7BIGkEjs",
  Promise: Promise
});


app.use("/", (req,res) => {
    var response;
  googleMapsClient.geocode(
    {
      address: "1600 Amphitheatre Parkway, Mountain View, CA"
    },
    function(err, response) {
      if (!err) {
        var response = response.json.results;
        response.forEach(element => {
            console.log(element.geometry)
        });
      }
    }
  );
  res.render("home", { response });
});

app.listen(8080);

