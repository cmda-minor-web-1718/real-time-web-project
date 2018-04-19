var socket = io();
var two = document.getElementById('test');
var button = document.getElementById('geoLoc');
var long;
var lang;
console.log('vince');

button.addEventListener('click', function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = 'Geolocation is not supported in this browser';
    }
}, true)

function showPosition(position) {
    two.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;

    long = position.coords.longitude;
    lang = position.coords.latitude;

    var location = {
        long: long,
        lang: lang
    };
    
    console.log(long + ' , ' + lang);
    socket.emit('location', location);
}