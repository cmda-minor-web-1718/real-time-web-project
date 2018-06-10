var socket = io('http://localhost');
var input = document.getElementById('input');
var preview = document.getElementById('content');

input.addEventListener(
	'keyup',
	event => {
		preview.innerHTML = marked(input.value);
	},
	true
);

var thisLocation = window.location.pathname;
while (thisLocation.charAt(0) === '/') {
	thisLocation = thisLocation.substr(1);
}
console.log(thisLocation);

socket.on('news', function(data) {
	console.log(data);
	socket.emit('my other event', { my: 'data' });
});
