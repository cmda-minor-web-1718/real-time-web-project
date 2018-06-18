const express = require('express');
const dotenv = require('dotenv').config();
const http = require('http');
const socketIO = require('socket.io');
const marked = require('marked');
const shortid = require('shortid');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

let contentsOfRooms = [];

// https://scotch.io/tutorials/use-ejs-to-template-your-node-application
app.set('view engine', 'ejs');

// server files in the static folder when '/static' is requested
app.use('/static', express.static('static'));

// get the directory
app.get('/', (req, res) => {
	let newId = shortid.generate();
	res.render('home', { id: newId });
});

// go to room
app.get('/:newId', (req, res) => {
	console.log(req.params.newId);
	let roomName = req.params.newId;
	res.render('room', { response: roomName });
});


// socket connection
io.on('connection', function(socket){
	console.log('user connects');
	socket.broadcast.emit('hi');

	// emit something
	socket.emit('file', { hello: 'world' });
		socket.on('my other event', data =>  {
			contentsOfRooms.push(data);
			console.log(contentsOfRooms);
			socket.emit('contentroom', contentsOfRooms);
	});

	 // user disconnects
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

server.listen(7008, () => {
	console.log('app is running on localhost:7008, WAHOOO');
});
