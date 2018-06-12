var socket = io(`http://localhost:7008`);
var input = document.getElementById('input');
var preview = document.getElementById('content');
var tekst = 'tekst';

// location
var thisLocation = window.location.pathname;
while (thisLocation.charAt(0) === '/') {
	thisLocation = thisLocation.substr(1);
}

input.addEventListener(
	'keyup',
	event => {
		preview.innerHTML = marked(input.value);
		var totalOnPage = {
			markedTekst: preview.innerHTML,
			roomId: thisLocation,
		}
		socket.on('file', function (data) {
			socket.emit('my other event', totalOnPage);
		});
	},
	true
);

var totalOnPage = {
	markedTekst: preview.innerHTML,
	roomId: thisLocation,
}

console.log(totalOnPage)



