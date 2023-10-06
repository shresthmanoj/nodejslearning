// define package

const express = require("express");

const connectdb = require("./database/db");
var bodyParser = require("body-parser");
const router = require("./routes/user_routes1");
const Router2 = "./components/Body.js";

//api
const PassCatAPI = require("./api/add-category");
const router2 = require("./components/Body");

connectdb(); //database connect

//app express feature use
const app = express();
app.use(bodyParser.json({ type: "application/*+json" }));
app.use(router); //express use router

app.use(router2);
//get,post,update/patch,delete
app.get("/", function (req, res) {
  res.send("Hello Manoj");
});

app.get("/header", function (req, res) {
  res.send("Hello Header");
});
app.get("/about", function (req, res) {
  res.send("Hello About");
});

//api
app.use("/api", PassCatAPI);

app.listen(4000, function () {
  console.log("Server is running at 4000 port");
});

module.exports = app;
