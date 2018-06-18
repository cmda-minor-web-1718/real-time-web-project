var socket = io(`http://localhost:7008`);
var input = document.getElementById('input');
var preview = document.getElementById('content');

// location
var thisLocation = window.location.pathname;
while (thisLocation.charAt(0) === '/') {
	thisLocation = thisLocation.substr(1);
}

var totalOnPage = {
	markedTekst: preview.innerHTML,
	roomId: thisLocation,
}

input.addEventListener(
	'keyup',
	event => {
		preview.innerHTML = marked(input.value);
		totalOnPage = {
			markedTekst: preview.innerHTML,
			roomId: thisLocation,
		}
		socket.emit('my other event',totalOnPage);
	},
	true
);


socket.on('contentroom', (content) => {
	console.log(content);
	if (content.roomId === thisLocation) {

		if (preview.innerHTML !== content.markedTekst) {
			preview.innerHTML = content.markedTekst;
		}
	}
})
