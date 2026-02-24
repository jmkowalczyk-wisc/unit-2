// main.js - Joseph Kowalczyk
var map; // Map variable, allows layers to be added at any scope
var minVal; // Minimum value for proportional symbols

// Step 1 - Create Leaflet Map
function mapInit(){
    map = L.map('map').setView([0, 0], 2);

    // Add a tile layer basemap using OpenStreetMap tiles, and attribute OpenStreetMap.
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map); // Adds the tile layer to the map. .addTo(map) will always be used to add a feature to the map.

    // Call addData, loading Lab 1 data and creating markers.
    addData(map);
}

function calculateMinVal(data){
    var allVals = []; // Blank array to store all data values
    for (var country of data.features){ // For each country feature of the data...
        for (var year = 2014; year <= 2023; year += 1) { // For each year between 2014 and 2023...
            var val = country.properties[year.toString()] // Get the percentage of renewable energy generation for the year
            allVals.push(val) // Push the current value to the allVals array
        };
    };
    var minVal = Math.min(...allVals); // Find the smallest value in the allVals array. ... is a spread operator, treating an array like allVals into multiple elements, allowing Math.min() to function.
    return minVal;
};

function calculatePropRadius(attValue){
    var minRadius = 5 // Constant value to adjust symbol sizes above
    var radius = 1.0083 * Math.pow(attValue / minVal, 0.5715) * minRadius // Flannery Scaling, human eye cannot percieve mathematical proportional scaling
    return radius;
};

// Step 3: Add circle markers for point features to the map.
function createPropSymbols(data){

    // Step 4: Determine attribute to scale proportional symbols
    var attribute = "2014"

    var geojsonMarkerStyle = {
        radius: 8,
        fillColor: '#dd0',
        color: '#000',
        weight: 1,
        fillOpacity: 0.5
    };

    L.geoJson(data, { // Create a geojson layer, use pointToLayer to add the points to the map, then uses onEachFeature to add popups.
        pointToLayer: function (feature, latlng){
            // Step 5: For each feature, determine its value for the selected attribute
            var attValue = Number(feature.properties[attribute]);
            // Step 6: Give each feature's circle marker a radius based on its attribute value
            geojsonMarkerStyle.radius = calculatePropRadius(attValue);
            // Create circle markers
            return L.circleMarker(latlng, geojsonMarkerStyle);
        },
    }).addTo(map);
};

// Step 2: Import GeoJSON Data
function addData(map){
    // Fetch data with AJAX, then pass the response to a callback function to create marker options and initialize a geojson layer
    fetch("data/ElectricityGenRenewPercent.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            minVal = calculateMinVal(json);
            createPropSymbols(json);
        });
};

document.addEventListener('DOMContentLoaded', mapInit)