const express = require("express"),
  path = require("path"),
  fs = require("fs"),
  sio = require("socket.io"),
  http = require("http"),
  utils = require("./util.js");

const port = 8080;

let app = express(),
  httpServ = http.createServer(app),
  io = sio(httpServ);

app.use(express.static(__dirname + "/html"));
app.use(express.static(__dirname + "/html/js"));
app.use(express.urlencoded());
app.use(express.json());

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/html/index.html");
});

io.on("connection", socket => {
  console.log("User connected.");

  socket.theirUUID = utils.generateID(16);
  socket.theirNickname = "UNO Player " + Math.floor(Math.random() * 1000000);

  console.log(socket.theirNickname);
});

httpServ.listen(port, function() {
  console.log("Listening on port " + port.toString());
});
