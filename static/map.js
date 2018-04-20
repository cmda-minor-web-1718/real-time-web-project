var socket = io();
var two = document.getElementById('test');
var button = document.getElementById('geoLoc');
var geoLocation = {
    lat: 51.505,
    long: -0.09
};
var long;
var lat;
console.log('vince');

var mymap = L.map('map').setView([geoLocation.lat, geoLocation.long], 13);

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);
    } else {
        x.innerHTML = 'Geolocation is not supported in this browser';
    }
}

function showPosition(position) {
    two.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;

    geoLocation = {
        long: position.coords.longitude,
        lat: position.coords.latitude
    }
    
    // console.log(geoLocation.long + ' , ' + geoLocation.lat);
    socket.emit('geoLocation', geoLocation);
    // console.log(geoLocation);

    // map
    
    mymap.setView([geoLocation.lat, geoLocation.long])

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoidmluY2VudGtlbXBlcnMiLCJhIjoiY2pnNnRhYW9zMG8wcDMycnc4dDh3aDNjNyJ9.-wLNslCspydMxYt3w2Xnhw'
    }).addTo(mymap);

    var circle = L.marker([geoLocation.lat, geoLocation.long], {
        color: 'green',
        fillColor: '#f03',
        fillOpacity: 0.5
    }).addTo(mymap);


    return geoLocation = {
        long: position.coords.longitude,
        lat: position.coords.latitude
    }
    
};

getLocation();
console.log(geoLocation);

var mymap = L.map('map').setView([geoLocation.lat, geoLocation.long], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoidmluY2VudGtlbXBlcnMiLCJhIjoiY2pnNnRhYW9zMG8wcDMycnc4dDh3aDNjNyJ9.-wLNslCspydMxYt3w2Xnhw'
}).addTo(mymap);

var circle = L.circle([51.505, -0.09], {
    color: 'green',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 100
}).addTo(mymap);