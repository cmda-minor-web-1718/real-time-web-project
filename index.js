const express = require("express");
const googleMaps = require("@google/maps");
const db = require("dotenv");

db.connect({
  api: process.env.DB_PROJECT_API,
});


const app = express();


app.set('view engine', 'ejs');

var googleMapsClient = googleMaps.createClient({
  key: api,
  Promise: Promise
});


app.use("/", (req,res) => {
    var response;
  googleMapsClient.geocode(
    {
      address: "52.662677,4.832477"
    },
    function(err, response) {
      if (!err) {
        var response = response.json.results;
        response.forEach(element => {
          console.log(element.address_components);
        });
      }
    }
  );
  res.render("home", { response });
});

app.listen(8080);

