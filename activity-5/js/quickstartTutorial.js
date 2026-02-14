// Initialize the map, set its view to coordinates [51.505, -0.09] and zoom level 13
var map = L.map('map').setView([51.505, -0.09], 13);

// Add a tile layer basemap using OpenStreetMap tiles, set maximum zoom to 19, and attribute OpenStreetMap.
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map); // Adds the tile layer to the map. .addTo(map) will always be used to add a feature to the map.

var marker = L.marker([51.5, -0.09]).addTo(map); // Initializes a marker at coordinates [51.5, 0.09] and adds it to the map.

var circle = L.circle([51.508, -0.11], { // Initializes a circle at coordinates [51.508, -0.11] with specified options and adds it to the map.
    color: 'red', // Sets circle border color to 'red'
    fillColor: '#f03', // Sets circle fill color to a brighter red. color and FillColor supports hex color codes.
    fillOpacity: 0.5, // Sets the fill opacity of the circle to 0.5.
    radius: 500 // Sets the radius of the circle to 500 meters (?)
}).addTo(map) // Adds the circle to the map.

// Initializes a polygon with an array of coordinates.
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map); // Adds the polygon to the map.

// Binds popups to each added feature.
marker.bindPopup("<b>Hello world!</b> I am a popup.").openPopup(); // .openPopup() will open the popup immediately after binding it to the marker.
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

var popup = L.popup() // Initializes a standalone popup.
    .setLatLng([51.513, -0.09])  // Sets coordinate of popup
    .setContent("I am a standalone popup.") // Sets text contetn of popup
    .openOn(map); // .openOn() will add the popup to the map and open it. If another popup is already open, it will be closed.

// Map clicks send events, which can be listened to the .on() method.
// onMapClick sends an alert with the coordinates of the click event.
//function onMapClick(e) { 
    //alert("You clicked the map at " + e.latlng);
//}

//map.on('click', onMapClick); // Listens for the click event, calls onMapClick when the event occurs.

// Above code can be simplified with an anonymous function.
var popup2 = L.popup(); // Initializes another standalone popup.
function onMapClick(e) {
    popup2 // Indentation can be used to chain methods for better readability, as seen here and with popup.
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng)
        .openOn(map);
};
map.on('click', onMapClick); // Listens for the click event, calls onMapClick when the event occurs.