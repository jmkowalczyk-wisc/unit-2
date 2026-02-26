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
function pointToLayer(feature, latlng, attributes){

    // Determine attribute to scale proportional symbols
    var attribute = attributes[0];

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

function createPropSymbols(data, attributes){
    L.geoJson(data, { // Create a geojson layer, use pointToLayer to add the points to the map, then uses onEachFeature to add popups.
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};

// Start of sequence control implementation
// Create new sequence controls
// createSequenceControls needs to be passed the list of attributes as a parameter in order for the slider/buttons to change the markers and the popup.
function createSequenceControls(attributes){
    var slider = "<input class='range-slider' type='range'></input>" // Creating the slider input element
    document.querySelector("#panel").insertAdjacentHTML('beforeend', slider) // Adding the input element to the HTML
    // Set slider attributes
    document.querySelector('.range-slider').max = 9; // Maximum value the slider can take
    document.querySelector('.range-slider').min = 0; // Minimum value the slider can take
    document.querySelector('.range-slider').value = 0; // The value the slider starts with
    document.querySelector('.range-slider').step = 1; // How much the slider value increments per step

    // Add step buttons
    document.querySelector('#panel').insertAdjacentHTML('beforeend','<button class="step" id="reverse"></button>');
    document.querySelector('#panel').insertAdjacentHTML('beforeend','<button class="step" id="forward"></button>');
    // Replace buttons with images
    document.querySelector('#reverse').insertAdjacentHTML('beforeend',"<img src='img/back.png'>")
    document.querySelector('#forward').insertAdjacentHTML('beforeend',"<img src='img/forward.png'>")

    // Click listener for buttons
    document.querySelectorAll('.step').forEach(function(step){
        step.addEventListener("click", function(){
            var index = document.querySelector('.range-slider').value
            if (step.id == 'forward'){
                index++;
                // If past the last attribute, wrap around to first attribute
                index = index > 9 ? 0 : index;
            } else if (step.id == 'reverse'){
                index--;
                // If past the first attribute, wrap around to last attribute
                index = index < 0 ? 9 : index;
            };

            // Update slider
            document.querySelector('.range-slider').value = index;

            // Pass new attribute to update symbols
            updatePropSymbols(attributes[index]);
        })
    })

    // Input listener for slider
    document.querySelector('.range-slider').addEventListener('input', function(){            
        var index = this.value; // Set variable index to the current value of the slider.

        // Pass new attribute to update symbols
        updatePropSymbols(attributes[index]);
    });
};

// Create array of attributes to iterate through ith the slider
function processData(data){
    //Empty array to hold attributes
    var attributes = [];

    //Properties of the first feature in the lab 1 data
    var properties = data.features[0].properties;

    //Push each attribute name into attributes array
    for (var attribute in properties){
        // Only take attributes with year values. Years in the Lab 1 data do not have a common prefix string, and are only numbers.
        if (!attribute.includes('country') && !attribute.includes('lat') && !attribute.includes('lon')){
            attributes.push(attribute);
        };
    };
    return attributes;
};

function updatePropSymbols(attribute){
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){ // Checks for existence of the layer, and the selected property in the layer feature's properties.
            //access feature properties
            var properties = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calculatePropRadius(properties[attribute]);
            layer.setRadius(radius);

            //add city to popup content string
            var popupContent = "<p><b>Country:</b> " + properties.country + "</p>";

            //add formatted attribute to panel content string
            var year = attribute.toString();
            popupContent += "<p><b>Renewable Percentage of Electricity Generation in " + year + ":</b> " + properties[attribute] + "%</p>";

            //update popup content            
            popup = layer.getPopup();            
            popup.setContent(popupContent).update();
        };
    });
};

// Import GeoJSON Data
function addData(map){
    fetch("data/ElectricityGenRenewPercent.geojson") // Retrieve lab 1 data...
        .then(function(response){
            return response.json(); // Then return the retrieved data in .json format...
        })
        .then(function(json){
            var attributes = processData(json); // Create array of attributes for slider
            minVal = calculateMinVal(json); // Then calculate the minimum value as per the calculateMinVal function...
            createPropSymbols(json, attributes); // Create proportional symbols, based on the value from calculateMinVal()
            createSequenceControls(attributes); // Create sequence slider and buttons. Needs to be passed attributes in order to change the map.
        });
};

document.addEventListener('DOMContentLoaded', mapInit)