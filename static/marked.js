var socket = io();
var input = document.getElementById('input');
var preview = document.getElementById('content');

// location
var thisLocation = window.location.pathname;
while (thisLocation.charAt(0) === '/') {
	thisLocation = thisLocation.substr(1);
}

input.addEventListener(
	'input',
	event => {
		var totalOnPage = {
			markedTekst: input.value,
			roomId: thisLocation,
		};

		// send the new value and thislocation/roomid
		socket.emit('my other event', totalOnPage);
	},
	true
);

// On enter room emit event to join room
socket.emit('joinRoom', thisLocation);

// Receive latest text on joining a room
socket.on('hello', latestTekst => {
	input.value = latestTekst;
});

socket.on('updatedTekst', content => {
	console.log(content);
	input.value = content;
	preview.innerHTML = marked(input.value);
});
