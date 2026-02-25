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

// Add circle markers for point features to the map.
function pointToLayer(feature, latlng){

    // Determine attribute to scale proportional symbols
    var attribute = "2014"

    var geojsonMarkerStyle = {
        radius: 8,
        fillColor: '#dd0',
        color: '#000',
        weight: 1,
        fillOpacity: 0.5
    };

    // For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    // Give each feature's circle marker a radius based on its attribute value
    geojsonMarkerStyle.radius = calculatePropRadius(attValue);

    // Create circle markers
    var layer = L.circleMarker(latlng, geojsonMarkerStyle);

    // Create content of popups for the markers
    var popupContent = "<p><b>Country:</b> " + feature.properties.country + '</p><p><b>Renewable Percentage of Electricity Generation in ' + attribute + ':</b> ' + feature.properties[attribute] + '%</p>';

    // Bind popup to circle marker
    layer.bindPopup(popupContent, {
        offset: new L.Point(0, -geojsonMarkerStyle.radius)
    });

    // Return the circle marker to L.geojson pointToLayer.
    return layer;
};

function createPropSymbols(data, map){
    L.geoJson(data, { // Create a geojson layer, use pointToLayer to add the points to the map, then uses onEachFeature to add popups.
        pointToLayer: pointToLayer
    }).addTo(map);
};

// Start of sequence control implementation
// Create new sequence controls
function createSequenceControls(){
    var slider = "<input class='range-slider' type='range'></input>" // Creating the slider input element
    document.querySelector("#panel").insertAdjacentHTML('beforeend', slider) // Adding the input element to the HTML
    // Set slider attributes
    document.queryselector('.range-slider').max = 6; // Maximum value the slider can take
    document.queryselector('.range-slider').min = 0; // Minimum value the slider can take
    document.queryselector('.range-slider').value = 0; // The value the slider starts with
    document.queryselector('.range-slider').step = 1; // How much the slider value increments per step
};

// Import GeoJSON Data
function addData(map){
    // Fetch data with AJAX, then pass the response to a callback function to create marker options and initialize a geojson layer
    fetch("data/ElectricityGenRenewPercent.geojson") // Retrieve lab 1 data...
        .then(function(response){
            return response.json(); // Then return the retrieved data in .json format...
        })
        .then(function(json){
            minVal = calculateMinVal(json); // Then calculate the minimum value as per the calculateMinVal function...
            createPropSymbols(json, map); // Create proportional symbols, based on the value from calculateMinVal()
            createSequenceControls();
        });
};

document.addEventListener('DOMContentLoaded', mapInit)