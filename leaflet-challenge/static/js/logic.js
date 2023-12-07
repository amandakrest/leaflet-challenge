
// Use this link to load the GeoJSON data.

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";


// retrieve and load in data to console
d3.json(url).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    console.log(data);
    createFeatures(data.features);
  });
  
  function colorChange (depth){
    if (depth >= 90) {
        return "Red"
    }
    if (depth >= 70) {
        return "#FF9633"
    }
    if (depth >= 50) {
        return "#FFBE33"
    }
    if (depth >= 30) {
        return "#FFDD33"
    }
    if (depth >= 10) {
        return "#FFFF33"
    }
        return "#BBFF33"
  };

  function createFeatures(earthquakeData) {

  
    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
    function eachMarker (feature, place) {
        return L.circleMarker(place);
    }

    function styleMarker (feature) {
        // console.log(feature.properties.mag);
        console.log(feature.geometry.coordinates[2]);
        return{
            radius: feature.properties.mag*3,
            weight: 1,
            color: colorChange(feature.geometry.coordinates[2])
        }
    }
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: eachMarker,
      style: styleMarker
    });
  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
  }
  
  function createMap(earthquakes) {
  
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes
    };
    //create map
    let myMap = L.map('map', {
        center:[20.2,20.3],
        zoom: 2,
        layers: [street, earthquakes]
    });
    
  
    // Create a layer control.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    //create legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {
  
    var div = L.DomUtil.create('div', 'info legend'),
    depth = [-10, 10, 30, 50, 70, 90];
  
  
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
        '<i style="background:' + colorChange(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
      }
  
    return div;
  };
  
  legend.addTo(myMap);

  
  }
  

