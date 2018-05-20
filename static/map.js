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
  // show the lat long on the page
  two.innerHTML = "Latitude: " + position.coords.latitude +
  "<br>Longitude: " + position.coords.longitude;

  geoLocation.lat = position.coords.latitude;
  geoLocation.long = position.coords.longitude;

    // Emit the geoLocation
    socket.emit('geoLocation', geoLocation);
    // map view
    mymap.setView([geoLocation.lat, geoLocation.long])
};

// map
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoidmluY2VudGtlbXBlcnMiLCJhIjoiY2pnNnRhYW9zMG8wcDMycnc4dDh3aDNjNyJ9.-wLNslCspydMxYt3w2Xnhw'
}).addTo(mymap);

var circle = L.marker([geoLocation.lat, geoLocation.long], {
    color: 'green',
    fillColor: '#f03',
    fillOpacity: 0.5
}).addTo(mymap);

socket.on('userloc', (userGeoLocation) => {
  L.circle([userGeoLocation.lat, userGeoLocation.long], {
    color: 'red',
    fill: '#fff',
    radius: 10
  }).addTo(mymap);
});




getLocation();
