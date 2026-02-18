// Initialize the map, set its view to coordinates [51.505, -0.09] and zoom level 13
var map = L.map('map').setView([0, 0], 2);

// Add a tile layer basemap using OpenStreetMap tiles, set maximum zoom to 19, and attribute OpenStreetMap.
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map); // Adds the tile layer to the map. .addTo(map) will always be used to add a feature to the map.

// Fetch data with AJAX, then initialize a styling variable, then add a geojson leaflet layer.
fetch("data/MegaCities.geojson")
    .then(function(response){
        return response.json();
    })
    .then(function(json){
        var geojsonMarkerStyle = {
            radius: 8,
            fillColor: '#70f',
            color: '#000',
            weight: 1,
            fillOpacity: 0.5
        };

        L.geoJson(json, { // Create a geojson layer, use pointToLayer to add the points to the map, then uses onEachFeature to add popups.
            pointToLayer: function (feature, latlng){
                return L.circleMarker(latlng, geojsonMarkerStyle);
            },
            onEachFeature: onEachFeature
        }).addTo(map);
    });

// Add popups to each feature from MegaCities.geojson
function onEachFeature(feature, layer) {
    // No dedicated popup content exists in the geojson, we need to create an html string to store the data
    var popupContent = "";
    if (feature.properties) { // If the feature has properties
        for (var property in feature.properties) { // For each property in the feature
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>"; // Adds a string like "<p>property: value</p> to the html for the popup"
        };
        layer.bindPopup(popupContent); // Bind the popup to the feature
    };
};