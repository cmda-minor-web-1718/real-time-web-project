const express = require("express");


const app = express();
app.set('view engine', 'ejs');


app.use("/", (req,res) => {
  const test = "test";
  res.render("home", { test });
});

app.listen(8080);