var socket = io();
var two = document.getElementById('test');
var button = document.getElementById('geoLoc');
var geoLocation = {};
var long;
var lat;
console.log('vince');

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);
    } else {
        x.innerHTML = 'Geolocation is not supported in this browser';
    }
};

function showPosition(position) {
    two.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;

    long = position.coords.longitude;
    lat = position.coords.latitude;

    geoLocation = {
        long: long,
        lat: lang
    };
    
    console.log(long + ' , ' + lat);
    socket.emit('geoLocation', geoLocation);


};

var mymap = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoidmluY2VudGtlbXBlcnMiLCJhIjoiY2pnNnRhYW9zMG8wcDMycnc4dDh3aDNjNyJ9.-wLNslCspydMxYt3w2Xnhw'
}).addTo(mymap);