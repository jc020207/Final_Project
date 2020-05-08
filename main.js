/* =====================
Leaflet Configuration
===================== */

var map = L.map('map', {
  center: [37.753267, -122.514989],
  zoom: 12
});


var CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map);

/* =====================
Specify Data
===================== */

var hexmap = "https://raw.githubusercontent.com/jc020207/Final_Project/master/hexmap.geojson";
var infrustructure = "https://raw.githubusercontent.com/jc020207/Final_Project/master/Infrastructure.geojson";
var communityC = "https://raw.githubusercontent.com/jc020207/Final_Project/master/CommunityC.geojson";
var featureGroup;
var featureGroup1;

/* =====================
Custom symbols
===================== */

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};


/* =====================
Load Initial Slide
===================== */
$(document).ready(function() {
  $.ajax(communityC).done(function(data) {
    var parsedData = JSON.parse(data);
    featureGroup = L.geoJson(parsedData, {
      pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, geojsonMarkerOptions);
    },
      }).addTo(map);
    // quite similar to _.each
    //featureGroup.eachLayer(eachFeatureFunction);
  });
});

/* =====================
Load Slide Function
===================== */
// load activeness layer
var loadact = function(slide) {
  //remove previous layer when load
  map.removeLayer(featureGroup);
//  map.removeLayer(featureGroup1);
  //load slides
  $(document).ready(function() {
    $.ajax(hexmap).done(function(data) {
      var parsedData = JSON.parse(data);
      featureGroup = L.geoJson(parsedData, {
    }).addTo(map);
    });
  });};

// load suitabiltiy layer
  var loadsuit = function(slide) {
    //remove previous layer when load
    map.removeLayer(featureGroup);
  //  map.removeLayer(featureGroup1);
    //load slides
    $(document).ready(function() {
      $.ajax(hexmap).done(function(data) {
        var parsedData = JSON.parse(data);
        featureGroup = L.geoJson(parsedData, {
      }).addTo(map);
      });
    });};

// load infrastructure and community Center Layer
  var loadinfra = function(slide) {
      //remove previous layer when load
      map.removeLayer(featureGroup);
      //map.removeLayer(featureGroup1);
      //load slides
      $(document).ready(function() {
        $.ajax(infrustructure).done(function(data) {
          var parsedData = JSON.parse(data);
          infra = L.geoJson(parsedData, {
        })
        });
      });

      $(document).ready(function() {
        $.ajax(communityC).done(function(data) {
          var parsedData = JSON.parse(data);
         center = L.geoJson(parsedData, { pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
          },
        })
        });
      });

      featureGroup=L.layerGroup([infra, center]).addTo(map);
    };

// Click Button
$('#activeness').click(function(e) {
          loadact();
        });

$('#suitability').click(function(e) {
          loadsuit();
        });

$('#infrastructure').click(function(e) {
          loadinfra();
        });
