var socket = io();
var two = document.getElementById('test');
var button = document.getElementById('geoLoc');
var location = {};
var lang;
var long;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = 'Geolocation is not supported in this browser';
    }
}


function showPosition(position) {
    two.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;

    long = position.coords.longitude;
    lang = position.coords.latitude;


    
    socket.emit('location', location);
    console.log(typeof location.long)
}


