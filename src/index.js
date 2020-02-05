const express = require('express'),
	path = require('path'),
	fs = require('fs'),
	sio = require('socket.io'),
	http = require('http'),
	utils = require('./util.js');

const port = 8080;

let app = express(),
	httpServ = http.createServer(app),
	io = sio(httpServ);

app.use(express.static(__dirname + '/html'));
app.use(express.static(__dirname + '/html/js'));
app.use(express.urlencoded());
app.use(express.json());

// Guanine
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/html/index.html');
});

io.on('connection', socket => {
	console.log('User connected! Hooking into their socket now.');

	socket.theirUUID = utils.generateID(16);
	socket.theirNickname = 'Player ' + Math.floor(Math.random() * 1000000);

	socket.on('joinHandshake', gameId => {
		socket.requestedGame = gameId;
		socket.currentGame = gameId;
	});
	socket.on('gameReadyUp', () => {
		if (!socket.currentGame) {
			// TODO: Kill the socket, it's evil!!!
			return;
		}
	});
});

httpServ.listen(port, function() {
	console.log('Listening on port ' + port.toString());
});
