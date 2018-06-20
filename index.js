const express = require('express');
const dotenv = require('dotenv').config();
const http = require('http');
const socketIO = require('socket.io');
const marked = require('marked');
const shortid = require('shortid');
const mongoose = require('mongoose');
const diffMatchPatch = require('diff-match-patch');
const session = require('express-session');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();
const server = http.Server(app);
const io = socketIO(server);
const dmp = new diffMatchPatch();

let contentsOfRooms = {
	'rJ78TpU-7': 'woop',
};

const sessionMiddleware = session({
	secret: process.env.SECRET,
	key: process.env.KEY,
	resave: false,
	saveUninitialized: false,
});

// database connection
mongoose.connect(process.env.MONGO_LINK);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', err => {
	console.error(err.message);
});
const RoomDb = require('./data/Room.js');

var config = {
	client_id: process.env.GH_CI,
	client_secret: process.env.GH_CS,
	redirect_url: 'http://localhost:3000/github/callback',
	authorize_url: 'https://github.com/login/oauth/authorize',
	token_url: 'https://github.com/login/oauth/access_token',
	user_url: 'https://api.github.com/user',
	scope: 'user',
};

// https://scotch.io/tutorials/use-ejs-to-template-your-node-application
app.set('view engine', 'ejs');

// server files in the static folder when '/static' is requested
app.use('/static', express.static('static'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// temporary username save
app.use(sessionMiddleware);

// get the directory
app.get('/', (req, res) => {
	let newId = shortid.generate();
	res.render('home', { id: newId });
});

app.get('/login', (req, res) => {
	res.redirect(
		'https://github.com/login/oauth/authorize?client_id=f03e10a6a5e093f0eb14&type=user_agent&redirect_uri=http://localhost:7008/handle-oauth'
	);
});

app.get('/handle-oauth', (req, res) => {
	console.log(req.query.code);

	// configure request params
	const options = {
		method: 'POST',
		uri: config.token_url,
		formData: {
			client_id: 'f03e10a6a5e093f0eb14',
			client_secret: process.env.GH_CS,
			code: req.query.code,
		},
		headers: {
			accept: 'application/json',
		},
	};
	// 1 make call to api for user's username

	// make a request for auth_token using above options
	// 2 set the user's username in req.session.username
	request(options, function(err, resp, body) {
		if (body) {
			let parsedBody = JSON.parse(body);

			options_user = {
				method: 'GET',
				url: config.user_url + '?access_token=' + parsedBody.access_token,
				headers: { accept: 'application/json', 'User-Agent': 'custom' },
			};
		}
		request(options_user, function(err2, resp2, body2) {
			if (body2) {
				let parsedBody2 = JSON.parse(body2);
				console.log(parsedBody2.login);
				req.session.username = parsedBody2.login;
				res.redirect('/overview');
			}
		});
	});
});

app.post('/save/:roomId', (req, res) => {
	console.log(req.body);
	let roomSaveUrl = req.params.roomId;
	RoomDb.findOneAndUpdate({ roomId: roomSaveUrl }, { text: req.body.textarea }).then(response => {
		console.log(response);

		res.redirect(`/room/${req.params.roomId}`);
	});
});

app.get('/overview', (req, res) => {
	let newId = shortid.generate();
	res.render('overview', { id: newId });
});
// go to room
app.get('/room/:newId', (req, res) => {
	console.log(req.params);
	let roomName = req.params.newId;

	// 1 Create room in database
	const instance = new RoomDb({
		roomId: req.params.newId,
	});

	// Save room into model
	instance.save().then(() => {
		// 2 Check if the user is logged in (req.session.usrname)
		if (req.session.username) {
			console.log('Logged in');
			// 3 If the user is logged in update the model by pushing name into the members array of the RoomDb model
			RoomDb.findOneAndUpdate(
				{ roomId: req.params.newId },
				{ $push: { members: req.session.username } }
			).then(response => {
				// 4 render the template and give the correct data to it
				// 5 In the render pass in the text from the db
				res.render('room', {
					response: contentsOfRooms[req.params.newId],
					roomId: req.params.newId,
				});
			});
		} else {
			console.log('Not logged in');

			RoomDb.findOne({ roomId: req.params.newId }).then(response => {
				res.render('room', {
					response: contentsOfRooms[req.params.newId],
					roomId: req.params.newId,
				});
			});
		}
	});
});

// socket connection
io.on('connection', function(socket) {
	console.log('user connects');

	// here socket on en dan join room
	socket.on('joinRoom', function(room) {
		// Create emptry key value pair in contentsofRooms
		// contentsOfRooms[room] = '# welcome to the markdown editor';
		// on joining room send latest texts

		// emit to room with new stuff
		socket.join(room).emit('invigorateFirstText', contentsOfRooms[room]);
	});
	// emit something
	socket.emit('file', { hello: 'world' });
	socket.on('my other event', data => {
		const textToCheck = contentsOfRooms[data.roomId] ? contentsOfRooms[data.roomId] : '';
		// contentsOfRooms[data.roomId] = data.markedTekst;
		const diffs = dmp.diff_main(textToCheck, data.markedTekst);
		const patch = dmp.patch_make(textToCheck, diffs);
		const updatedTekst = dmp.patch_apply(patch, textToCheck);

		contentsOfRooms[data.roomId] = updatedTekst[0];

		// Emit the updatedtext and broadcast to room
		io.to(data.roomId).emit('updatedTekst', contentsOfRooms[data.roomId]);
	});

	// user disconnects
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

// server list
server.listen(7008, () => {
	console.log('app is running on localhost:7008, WAHOOO');
});
