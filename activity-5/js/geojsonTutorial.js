// Initialize the map, set its view to coordinates [51.505, -0.09] and zoom level 13
var map = L.map('map').setView([39.75621, -104.99404], 13);

// Add a tile layer basemap using OpenStreetMap tiles, set maximum zoom to 19, and attribute OpenStreetMap.
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map); // Adds the tile layer to the map. .addTo(map) will always be used to add a feature to the map.

var geojsonFeature = { // Initializes a geoJSON feature object.
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};

// L.geoJSON(geojsonFeature).addTo(map); // Reads geojsonFeature as a GeoJSON object and adds it to the map.

// Alternatively, you can initialize a geoJSON layer, and add geoJSON objects to it later.
var myLayer = L.geoJSON().addTo(map);
myLayer.addData(geojsonFeature);


var myLines = [{ // GeoJSON objects can also be added as an array of GeoJSON objects.
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

// geoJSON objects can also accept a style object as a second argument.
var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};
L.geoJSON(myLines, {style: myStyle}).addTo(map);

// You can also style geoJSON features individually within a function.
var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];

L.geoJSON(states, {
    style: function(feature) {
        switch (feature.properties.party) { // Switch statement that changes return value based on cases of the party property of each feature.
            case 'Republican': return {color: "#ff0000"};
            case 'Democrat':   return {color: "#0000ff"};
        }
    }
}).addTo(map);

// Points can be styld as circular markers by using pointToLayer.
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

L.geoJSON(geojsonFeature, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(map);

// onEachFeature iterates over each feature, in this case binding a popup.
function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

L.geoJSON(geojsonFeature, {
    onEachFeature: onEachFeature
}).addTo(map);