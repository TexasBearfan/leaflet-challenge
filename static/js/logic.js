//Storing API URL
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

//Request for data
d3.json(url).then(function (earthquakeData) {
    console.log(earthquakeData);
    createFeatures(earthquakeData.features);
});

//creating function to determine earthquake depth
function markerColor(depth){
    if (depth <= 10) return "lightgreen";
    else if (depth <= 25) return "darkgreen";
    else if (depth <= 50) return "yellow";
    else if (depth <= 100) return "orange";
    else if (depth <= 150) return "red";
    else return "darkred";
};
function markerSize(mag){
    size=mag*100000
    return size;
}
// Creating Features for the Map
function createFeatures(earthquakeData){
    //Creating Pop-ups with Discriptions and Data
    function onEachFeature(feature, layer) {
        layer.bindPopup(['<h3>Earthquake Location: ',String(feature.properties.place),'</h3><hr><p>Earthquake Date: ',String(new Date(feature.properties.time)),'</p><p>Earthquake Magnitude: ',String(feature.properties.mag),'</p><p>Earthquake Depth(km): ',String(feature.geometry.coordinates[2]),'</p></hr>'].join());
    };
    
    let earthquakes=L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, lat_lng) {
            color = markerColor(feature.geometry.coordinates[2]);

            var earthquakeMarkers = {
                radius: markerSize(feature.properties.mag),
                fillColor: color,
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7
            };
            return L.circle(lat_lng, earthquakeMarkers)
        }
    });

    //send info to create maps
    createMap(earthquakes);
};
//creating map
function createMap(earthquakes) {
    let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    let topography = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png');
    let earthquake = L.layerGroup(earthquakes);
    let baseMap = {"Street Map": streetMap, "Topographic Map": topography};
    let overlay = {Earthquakes: earthquakes};
    let myMap = L.map("map", {center: [-104.858,36.912], zoom: 2.0, layers: [streetMap, earthquakes]});
    L.control.layers(basemaps, overlay, {collapsed: false}).addTo(myMap);
}
