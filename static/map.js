var two = document.getElementById('demo');
var button = document.getElementById('geoLoc')

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
}