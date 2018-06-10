var input = document.getElementById('input');
var preview = document.getElementById('content');
input.addEventListener(
	'keyup',
	event => {
		preview.innerHTML = marked(input.value);
	},
	true
);
