const express = require('express');
const dotenv = require('dotenv').config();
const http = require('http');
const socketIO = require('socket.io');
const marked = require('marked');
const shortid = require('shortid');
const diffMatchPatch = require('diff-match-patch');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const dmp = new diffMatchPatch();

let contentsOfRooms = {
	'rJ78TpU-7': 'woop',
};

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
	// make room here

	res.render('room', { response: roomName });
});

// socket connection
io.on('connection', function(socket) {
	console.log('user connects');

	// here socket on en dan join room
	socket.on('joinRoom', function(room) {
		// on joining room send latest texts
		socket.join(room).emit('hello', contentsOfRooms[room]);
		// Create emptry key value pair in contentsofRooms
		contentsOfRooms[room] = '# welcome to the markdown editor';
	});
	// emit something
	socket.emit('file', { hello: 'world' });
	socket.on('my other event', data => {
		// contentsOfRooms[data.roomId] = data.markedTekst;
		const diffs = dmp.diff_main(contentsOfRooms[data.roomId], data.markedTekst);
		const patch = dmp.patch_make(contentsOfRooms[data.roomId], diffs);
		const updatedTekst = dmp.patch_apply(patch, contentsOfRooms[data.roomId]);

		contentsOfRooms[data.roomId] = updatedTekst[0];

		// Emit the updatedtext and broadcast to room
		io.to(data.roomId).emit('updatedTekst', contentsOfRooms[data.roomId]);
	});

	// user disconnects
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

server.listen(7008, () => {
	console.log('app is running on localhost:7008, WAHOOO');
});
