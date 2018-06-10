const express = require('express');
const dotenv = require('dotenv').config();
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

// https://scotch.io/tutorials/use-ejs-to-template-your-node-application
app.set('view engine', 'ejs');

// server files in the static folder when '/static' is requested
app.use('/static', express.static('static'));

// get the directory
app.get('/', (req, res) => {
	// empty variable to show response
	res.render('home', { response: 'response' });
});

app.get('/room', (req, res) => {
	let roomName = 'rick';
	res.render('room', { response: roomName });
});

server.listen(7008, () => {
	console.log('app is running on localhost:7008, WAHOOO');
});
