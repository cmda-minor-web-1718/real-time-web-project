var socket = io(`http://localhost:7008`);
var input = document.getElementById('input');
var preview = document.getElementById('content');

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
			markedTekst: input.value,
			roomId: thisLocation,
		}
		socket.emit('my other event', totalOnPage);
	},
	true
);


// var totalOnPage = {
// 	markedTekst: preview.innerHTML,
// 	roomId: thisLocation,
// }

socket.on('contentroom', (content) => {
	content.map(d => {
		console.log(d.markedTekst);
		if (d.roomId === thisLocation) {
			input.value = d.markedTekst;
		}
	})
})
