/* =====================
Leaflet Configuration
===================== */

var map = L.map('map', {
  center: [37.753267, -122.539910],
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
var infra;
var center;
var featureGroup_community;
var featureGroup_hex;

/* =====================
Parse Data
===================== */
var hex;
$.ajax(hexmap).done(function(data) {
  hex = JSON.parse(data);
});

var infraLocation;
$.ajax(infrustructure).done(function(data) {
  infraLocation = JSON.parse(data);
});

var community;
$.ajax(communityC).done(function(data) {
  community = JSON.parse(data);
});

/* =====================
Custom symbols and styles
===================== */

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#da7b93",
    color: "#fffff",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};

var introstyle = function(feature) {
    return {
        fillColor: '#ffffff',
        fillOpacity:0.2,
        weight: 0.5,
        opacity:0.8,
        color: 'white',
    };
}

var infrastyle = function(feature) {
    return {
        fillColor: '#376e6f',
        fillOpacity:0.7,
        weight: 0.5,
        opacity: 1,
        color: 'white',
    };
}

//style for activeness map
var activecolor =function(d) {
    return d > 5.52   ? '#800026' :
           d > 4.92   ? '#bd0026' :
           d > 4.33   ? '#e31a1c' :
           d > 3.74   ? '#fc4e2a' :
           d > 3.14   ? '#fd8d3c' :
           d > 2.55   ? '#feb24c' :
           d > 1.96   ? '#fed976' :
           d > 1.37   ? '#ffeda0' :
           d > 0.77   ? '#ffffcc' :
                      '#FCF8EC';
}

/* =====================
 Click the hexagon layer and show the pop up.
===================== */
var highlight = {
       'fillColor': '#d7191c',
       'weight': 2,
       'opacity': 1
   };

// doesn't highlight
function forEachFeature_Nohighlight(feature, layer) {
  var popupContent = "<p><b>Serve community: </b>"+ feature.properties.id +
      '</p>';
  layer.bindPopup(popupContent);
}
//Highlight when click
function forEachFeature(feature, layer) {
   var popupContent = "<p><b>Serve community: </b>"+ feature.properties.id +
   "</br><b>Facility type: </b>"+ feature.properties.facility_t +
  '</p>';
   layer.bindPopup(popupContent);
   layer.on("click", function (e) {
      layer.setStyle(highlight);  //highlights selected.
   });
}
/* =====================
 Click the community center layer and show the pop up.
===================== */
function forEachFeature_center_display(feature, layer) {
   var popupContent = "<p><b>Community center: </b>"+ feature.properties.ORIG_FID +
       '</p>';
   layer.bindPopup(popupContent);

   layer.on("click", function (e) {
      layer.setStyle(highlight);  //highlights selected.
   });
}
// Doesn't highlight community center
function forEachFeature_center(feature, layer) {
   var popupContent = "<p><b>Community center: </b>"+ feature.properties.ORIG_FID +
       '</p>';
   layer.bindPopup(popupContent);
}

// round to 2 demical
var round = function(feature){
    feature.properties.FINAL = feature.properties.FINAL.toFixed(2);
    feature.properties.suit_2 = feature.properties.suit_2.toFixed(2);
};

function forEachFeature_activeness(feature, layer) {
  round(feature);
  var popupContent = "<p><b>Activeness Score: </b>"+ feature.properties.FINAL +
      '</p>';
  layer.bindPopup(popupContent);
}

var activestyle = function(feature) {
    return {
        fillColor: activecolor(feature.properties.FINAL),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
}


//style for suitability map
var suitcolor =function(d) {
    return d > 5.75   ? '#084081' :
           d > 3.09   ? '#0868ac' :
           d > 2.07   ? '#2b8cbe' :
           d > 1.36   ? '#4eb3d3' :
           d > 0.98   ? '#7bccc4' :
           d > 0.69   ? '#a8ddb5' :
           d > 0.49   ? '#ccebc5' :
           d > 0.32   ? '#e0f3db' :
           d > 0.14   ? '#f7fcf0' :
                      '#F9FBF6';
}

function forEachFeature_suitability(feature, layer) {
  round(feature);
  var popupContent = "<p><b>Suitability Score: </b>"+ feature.properties.suit_2 +
      '</p>';
  layer.bindPopup(popupContent);
}

var suitstyle = function(feature) {
    return {
        fillColor: suitcolor(feature.properties.suit_2),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
}

/* =====================
build legend
===================== */
// for real estate activeness map

var activelegend = L.control({position: 'bottomright'});
activelegend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'active legend'),
        grades = [0, 0.77, 1.37,1.96, 2.55, 3.14, 3.74, 4.33, 4.92, 5.52],
        labels = [];
        for (var i = 0; i < grades.length; i++) {
              div.innerHTML +=
                  '<i style="background:' + activecolor(grades[i] + 0.01) + '"></i> ' +
                  grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
          }

    return div;
};

// for real suitability map
var suitlegend = L.control({position: 'bottomright'});
suitlegend.onAdd = function (map) {
    var diva = L.DomUtil.create('diva', 'suit legend'),
        grade = [0, 0.14, 0.32, 0.49, 0.69, 0.98, 1.36, 2.07, 3.09, 5.75],
        labels = [];
        for (var i = 0; i < grade.length; i++) {
              diva.innerHTML +=
                  '<i style="background:' + suitcolor(grade[i] + 0.01) + '"></i> ' +
                  grade[i] + (grade[i + 1] ? '&ndash;' + grade[i + 1] + '<br>' : '+');
          }
    return diva;
};
/* =====================
Load Initial Slide
===================== */
$(document).ready(function() {
  $.ajax(communityC).done(function(data) {
    var parsedData = JSON.parse(data);
    featureGroup_community = L.geoJson(parsedData, {
      pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, geojsonMarkerOptions);
    },
     onEachFeature:forEachFeature_center_display,
      })
  });

  $.ajax(hexmap).done(function(data) {
    var parsedData = JSON.parse(data);
    featureGroup_hex = L.geoJson(parsedData, {
    style:introstyle
  })
  featureGroup=L.layerGroup([featureGroup_hex,featureGroup_community]).addTo(map);
  featureGroup_community.bringToFront();
  });

});


/* =====================
  click to show radar chart event for real estate activeness map
    ===================== */
// set up chart

var activechartdata ={
labels: ['Social Activeness', 'Commercial Activeness', 'Transportation Accessibiltiy', 'Development Demand'],
datasets: [{
  label:'index',
  backgroundColor:['#DAF7A6','#FFC300','#FF5733','#C70039'],
  data: [0, 0, 0, 0]
}]
}

var options = {
  responsive: true,
  maintainAspectRatio: false,
  scale: {
    ticks: {
      beginAtZero: true,
      min: 0,
      max: 10,
      stepSize: 5
    }
  },
  legend: {
    position: 'left',
    labels: {  "fontSize": 10,}
  },
  tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    var label = data.datasets[tooltipItem.datasetIndex].label || '';
                    if (label) {
                        label += ': ';
                    }
                    label += Math.round(tooltipItem.yLabel * 100) / 100;
                    return label;
                }}}
};

var myactivechart = document.getElementById('myactiveChart').getContext('2d');

//plot chart function
var plotactiveradar = function(data){ myactiveRadarChart = new Chart(myactivechart, {
type: 'polarArea',
data: data,
options: options
});}

//function to get data and plot chart
var getactivechartdata = function(layer) {
layer.on('click', function (event) {
activechartdata.datasets[0].data[0]=layer.feature.properties.social;
activechartdata.datasets[0].data[1]=layer.feature.properties.act_final;
activechartdata.datasets[0].data[2]=layer.feature.properties.trans_nrom;
activechartdata.datasets[0].data[3]=layer.feature.properties.dem_norm;
console.log(activechartdata);
plotactiveradar(activechartdata);
});
};

/* =====================
  click to show radar chart event for suitability map
    ===================== */
// set up chart

var suitchartdata ={
labels: ['Contamination', 'Land Use', 'Flood Plain', 'Slope'],
datasets: [{
  label:'index',
  backgroundColor:['#DAF7A6','#FFC300','#FF5733','#C70039'],
  data: [0, 0, 0, 0]
}]
}

var mysuitchart = document.getElementById('mysuitChart').getContext('2d');

//plot chart function
var plotsuitradar = function(data){ mysuitRadarChart = new Chart(mysuitchart, {
type: 'polarArea',
data: data,
options: options
});}

//function to get data and plot chart
var getsuitchartdata = function(layer) {
layer.on('click', function (event) {
suitchartdata.datasets[0].data[0]=layer.feature.properties.cont_norm;
suitchartdata.datasets[0].data[1]=layer.feature.properties.land_norm;
suitchartdata.datasets[0].data[2]=layer.feature.properties.flood_norm;
suitchartdata.datasets[0].data[3]=layer.feature.properties.slope_norm;
console.log(suitchartdata);
plotsuitradar(suitchartdata);
});
};


/* =====================
Load Slide Function
===================== */
// load intro layer
var intro_load = function(){
    $(document).ready(function() {
      $.ajax(hexmap).done(function(data) {
        var parsedData = JSON.parse(data);
        featureGroup_hex_intro = L.geoJson(parsedData, {
        style:introstyle,
      });
    });
  });
    $(document).ready(function() {
      $.ajax(communityC).done(function(data) {
        var parsedData = JSON.parse(data);
        featureGroup_community_intro = L.geoJson(parsedData, {
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, geojsonMarkerOptions);},
        onEachFeature:forEachFeature_center_display,
      });
    });
  });
};
intro_load();

// load hexagon and community Center Layer
var loadintro = function() {
    map.removeControl(activelegend);
    map.removeControl(suitlegend);
    map.removeControl(demolegend);
    map.removeControl(commerlegend);
    map.removeControl(translegend);
    map.removeControl(demandlegend);
    map.removeControl(slopelegend);
    map.removeControl(contaminationlegend);
    map.removeControl(landuselegend);
    map.removeControl(floodlegend);

    map.removeLayer(featureGroup);
    var featureGroup1=L.layerGroup([featureGroup_hex_intro]).addTo(map);
    var featureGroup2=L.layerGroup([featureGroup_community_intro]).addTo(map);
    featureGroup=L.layerGroup([featureGroup_hex_intro,featureGroup_community_intro]).addTo(map);
};

// load activeness layer
var loadact = function(slide) {
  //remove previous layer when load
  map.removeControl(suitlegend);
  map.removeControl(demolegend);
  map.removeControl(commerlegend);
  map.removeControl(translegend);
  map.removeControl(demandlegend);
  map.removeControl(slopelegend);
  map.removeControl(contaminationlegend);
  map.removeControl(landuselegend);
  map.removeControl(floodlegend);

  map.removeLayer(featureGroup);
  //load slides
  $(document).ready(function() {
    $.ajax(hexmap).done(function(data) {
      var parsedData = JSON.parse(data);
      featureGroup = L.geoJson(parsedData, {
      style: activestyle,
      onEachFeature:forEachFeature_activeness,
    }).addTo(map);
    featureGroup.eachLayer(getactivechartdata);
    });
    activelegend.addTo(map);
  });};


// load suitabiltiy layer
  var loadsuit = function(slide) {
    //remove previous layer when load
    map.removeControl(activelegend);
    map.removeControl(suitlegend);
    map.removeControl(demolegend);
    map.removeControl(commerlegend);
    map.removeControl(translegend);
    map.removeControl(demandlegend);
    map.removeControl(slopelegend);
    map.removeControl(contaminationlegend);
    map.removeControl(landuselegend);
    map.removeControl(floodlegend);

    map.removeLayer(featureGroup);
    //load slides
    $(document).ready(function() {
      $.ajax(hexmap).done(function(data) {
        var parsedData = JSON.parse(data);
        featureGroup = L.geoJson(parsedData, {
        style:suitstyle,
        onEachFeature:forEachFeature_suitability,
      }).addTo(map);
      featureGroup.eachLayer(getsuitchartdata);
      });
      suitlegend.addTo(map);
    });};

//load both infrasturcture and community Center
var loadboth = function(x){$(document).ready(function() {
  $.ajax(infrustructure).done(function(data) {
    var parsedData = JSON.parse(data);
    infra = L.geoJson(parsedData, {
    style: infrastyle,
    onEachFeature:forEachFeature_Nohighlight,
  })
  });
});
$(document).ready(function() {
  $.ajax(communityC).done(function(data) {
    var parsedData = JSON.parse(data);
   center = L.geoJson(parsedData, {
     pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, geojsonMarkerOptions);
    },
      onEachFeature:forEachFeature_center,
  })
  });
});}

// run the function to load both layers
loadboth();

// map both infrastructure and community center
  var loadinfra = function(slide) {
      //remove previous layer when load
      map.removeControl(suitlegend);
      map.removeControl(activelegend);
      map.removeControl(demolegend);
      map.removeControl(commerlegend);
      map.removeControl(translegend);
      map.removeControl(demandlegend);
      map.removeControl(slopelegend);
      map.removeControl(contaminationlegend);
      map.removeControl(landuselegend);
      map.removeControl(floodlegend);

      map.removeLayer(featureGroup);

    document.getElementById("grocery").checked = false;
     document.getElementById("health").checked = false;
     document.getElementById("library").checked = false;
      //load slides
      var featureGroup1=L.layerGroup([infra]).addTo(map);
      var featureGroup2=L.layerGroup([center]).addTo(map);
      featureGroup=L.layerGroup([infra, center]).addTo(map);
    };



  /* =====================
    build real estate develiopment activeness slider
      ===================== */
// setup slider
    var activeslider = document.getElementById('activeslider');

    noUiSlider.create(activeslider, {
        start: [0, 6.1],
        connect: true,
        range: {
            'min': 0,
            'max': 6.1},
        tooltips:[true,true]
    });
// define global variables
var activeindex
var activeslidemin
var activeslidemax

//slider move event
    activeslider.noUiSlider.on('change',function(){
    activeindex = activeslider.noUiSlider.get();
    activeslidemin = activeindex[0];
    activeslidemax = activeindex[1];
    loadactslide();
    })

// slider filter funciton
var activeslidefilter = function(feature){
  return (feature.properties.FINAL<=activeslidemax && feature.properties.FINAL>=activeslidemin)
}

// load activeness layer function
var loadactslide = function(slide) {
  //remove previous layer when load
  map.removeControl(suitlegend);
  map.removeControl(demolegend);
  map.removeControl(commerlegend);
  map.removeControl(translegend);
  map.removeControl(demandlegend);
  map.removeControl(slopelegend);
  map.removeControl(contaminationlegend);
  map.removeControl(landuselegend);
  map.removeControl(floodlegend);

  map.removeLayer(featureGroup);
  //load slides
  $(document).ready(function() {
    $.ajax(hexmap).done(function(data) {
      var parsedData = JSON.parse(data);
      featureGroup = L.geoJson(parsedData, {
      style: activestyle,
      filter: activeslidefilter,
      onEachFeature:forEachFeature_activeness,
    }).addTo(map);
    featureGroup.eachLayer(getactivechartdata);
    });
    activelegend.addTo(map);
  });};

      /* =====================
        build suitabiltiy slider
          ===================== */


    // setup slider
        var suitslider = document.getElementById('suitslider');

        noUiSlider.create(suitslider, {
            start: [0, 10.1],
            connect: true,
            range: {
                'min': 0,
                'max': 10.1},
            tooltips:[true,true]
        });
    // define global variables
    var suitindex
    var suitslidemin
    var suitslidemax

    //slider move event
        suitslider.noUiSlider.on('change',function(){
        suitindex = suitslider.noUiSlider.get();
        suitslidemin = suitindex[0];
        suitslidemax = suitindex[1];
        console.log(suitslidemax);
        loadsuitslide();
        })

    // slider filter funciton
    var suitslidefilter = function(feature){
      return (feature.properties.suit_2<=suitslidemax && feature.properties.suit_2>=suitslidemin)
    }

    // load activeness layer function
    var loadsuitslide = function(slide) {
      //remove previous layer when load
      map.removeControl(activelegend);
      map.removeControl(suitlegend);
      map.removeControl(demolegend);
      map.removeControl(commerlegend);
      map.removeControl(translegend);
      map.removeControl(demandlegend);
      map.removeControl(slopelegend);
      map.removeControl(contaminationlegend);
      map.removeControl(landuselegend);
      map.removeControl(floodlegend);

      map.removeLayer(featureGroup);
      //load slides
      $(document).ready(function() {
        $.ajax(hexmap).done(function(data) {
          var parsedData = JSON.parse(data);
          featureGroup = L.geoJson(parsedData, {
          style: suitstyle,
          filter: suitslidefilter,
          onEachFeature:forEachFeature_suitability,
        }).addTo(map);
        featureGroup.eachLayer(getsuitchartdata);
        });
        suitlegend.addTo(map);
      });};


    /* =====================
    Click Button
    ===================== */
// Introduction section button
$('#introduction').click(function(e) {
              loadintro();
              $('.sidebar').hide();
              $('#sidebar_original').show();
            });

$('#activeness').click(function(e) {
          loadact();
          $('.sidebar').hide();
          $('#sidebar_1').show();
        });

$('#suitability').click(function(e) {
          loadsuit();
          $('.sidebar').hide();
          $('#sidebar_2').show();
        });

$('#infrastructure').click(function(e) {
          loadinfra();
          $('.sidebar').hide();
          $('#sidebar_3').show();
        });

// real-estate activeness section button
$('#introduction_1').click(function(e) {
                      loadintro();
                  $('.sidebar').hide();
                   $('#sidebar_original').show();
                    });
$('#activeness_1').click(function(e) {
                  loadact();
                  $('.sidebar').hide();
                  $('#sidebar_1').show();
                });
$('#suitability_1').click(function(e) {
                  loadsuit();
                  $('.sidebar').hide();
                  $('#sidebar_2').show();
                });
$('#infrastructure_1').click(function(e) {
                  loadinfra();
                  $('.sidebar').hide();
                  $('#sidebar_3').show();
                });

// suitability activeness section button
$('#introduction_2').click(function(e) {
                  loadintro();
                  $('.sidebar').hide();
                  $('#sidebar_original').show();
                });
$('#activeness_2').click(function(e) {
                  loadact();
                  $('.sidebar').hide();
                  $('#sidebar_1').show();
                });
$('#suitability_2').click(function(e) {
                  loadsuit();
                  $('.sidebar').hide();
                  $('#sidebar_2').show();
                });
$('#infrastructure_2').click(function(e) {
                  loadinfra();
                  $('.sidebar').hide();
                  $('#sidebar_3').show();
                });

// infrustructure section button
$('#introduction_3').click(function(e) {
                  loadintro();
                  $('.sidebar').hide();
                  $('#sidebar_original').show();
                });
$('#activeness_3').click(function(e) {
                  loadact();
                  $('.sidebar').hide();
                  $('#sidebar_1').show();
                });
$('#suitability_3').click(function(e) {
                  loadsuit();
                  $('.sidebar').hide();
                  $('#sidebar_2').show();
                });
$('#infrastructure_3').click(function(e) {
                  loadinfra();
                  $('.sidebar').hide();
                  $('#sidebar_3').show();
                });

/* =====================
Dropdown_activeness
===================== */
// style
var democolor =function(d) {
    return d > 7.33   ? '#7f0000' :
           d > 5.67   ? '#b30000' :
           d > 5.01  ? '#d7301f' :
           d > 4.59   ? '#ef6548' :
           d > 4.18  ? '#fc8d59' :
           d > 3.80  ? '#fdbb84' :
           d > 3.38   ? '#fdd49e' :
           d > 2.58   ? '#fee8c8' :
           d > 1.60   ? '#fff7ec' :
                      '#F9FBF6';
}
var commercolor =function(d) {
    return d > 5.26   ? '#49006a' :
           d > 3.20   ? '#7a0177' :
           d > 2.17  ? '#ae017e' :
           d > 1.54   ? '#dd3497' :
           d > 1.08  ? '#f768a1' :
           d > 0.76  ? '#fa9fb5' :
           d > 0.49   ? '#fcc5c0' :
           d > 0.25   ? '#fde0dd' :
           d > 0.07   ? '#fff7f3' :
                      '#F9FBF6';
}
var transcolor =function(d) {
    return d > 7.30   ? '#08306b' :
           d > 5.32   ? '#08519c' :
           d > 4.02  ? '#2171b5' :
           d > 3.30   ? '#4292c6' :
           d > 2.93  ? '#6baed6' :
           d > 2.54  ? '#9ecae1' :
           d > 2.05   ? '#c6dbef' :
           d > 1.53   ? '#deebf7' :
           d > 0.62   ? '#f7fbff' :
                      '#F9FBF6';
}
var demandcolor =function(d) {
    return d > 5.09   ? '#67000d' :
           d > 2.65   ? '#a50f15' :
           d > 1.21  ? '#cb181d' :
           d > 0.55   ? '#ef3b2c' :
           d > 0.35  ? '#fb6a4a' :
           d > 0.24  ? '#fc9272' :
           d > 0.13   ? '#fcbba1' :
           d > 0.06   ? '#fee0d2' :
           d > 0.02   ? '#fff5f0' :
                      '#F9FBF6';
}
// Style for each element
var demostyle = function(feature) {
    return {
        fillColor: democolor(feature.properties.social),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
};

var commerstyle = function(feature) {
    return {
        fillColor: commercolor(feature.properties.act_final),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
};

var transtyle = function(feature) {
    return {
        fillColor: transcolor(feature.properties.trans_nrom),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
};

var demandstyle = function(feature) {
    return {
        fillColor: demandcolor(feature.properties.dem_norm),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
};

//build legend for four getElements
var demolegend = L.control({position: 'bottomright'});
demolegend.onAdd = function (map) {
    var diva = L.DomUtil.create('diva', 'demo legend'),
        grade = [0.82, 1.61, 2.58, 3.38, 3.81, 4.18, 4.59, 5.01, 5.67, 7.33],
        labels = [];
        for (var i = 0; i < grade.length; i++) {
              diva.innerHTML +=
                  '<i style="background:' + democolor(grade[i] + 0.01) + '"></i> ' +
                  grade[i] + (grade[i + 1] ? '&ndash;' + grade[i + 1] + '<br>' : '+');
          }
    return diva;
};

var commerlegend = L.control({position: 'bottomright'});
commerlegend.onAdd = function (map) {
    var diva = L.DomUtil.create('diva', 'commer legend'),
        grade = [0.00, 0.07, 0.25, 0.49, 0.76, 1.08, 1.54, 2.71, 3.20, 5.26],
        labels = [];
        for (var i = 0; i < grade.length; i++) {
              diva.innerHTML +=
                  '<i style="background:' + commercolor(grade[i] + 0.01) + '"></i> ' +
                  grade[i] + (grade[i + 1] ? '&ndash;' + grade[i + 1] + '<br>' : '+');
          }
    return diva;
};

var translegend = L.control({position: 'bottomright'});
translegend.onAdd = function (map) {
    var diva = L.DomUtil.create('diva', 'trans legend'),
        grade = [0.00, 0.62, 1.53, 2.05, 2.54, 2.93, 3.30, 4.02, 5.32, 7.30],
        labels = [];
        for (var i = 0; i < grade.length; i++) {
              diva.innerHTML +=
                  '<i style="background:' + transcolor(grade[i] + 0.01) + '"></i> ' +
                  grade[i] + (grade[i + 1] ? '&ndash;' + grade[i + 1] + '<br>' : '+');
          }
    return diva;
};

var demandlegend = L.control({position: 'bottomright'});
demandlegend.onAdd = function (map) {
    var diva = L.DomUtil.create('diva', 'demand legend'),
        grade = [0.00, 0.02, 0.06, 0.13, 0.24, 0.35, 0.55, 1.21, 2.65, 5.09],
        labels = [];
        for (var i = 0; i < grade.length; i++) {
              diva.innerHTML +=
                  '<i style="background:' + demandcolor(grade[i] + 0.01) + '"></i> ' +
                  grade[i] + (grade[i + 1] ? '&ndash;' + grade[i + 1] + '<br>' : '+');
          }
    return diva;
};
/* =====================
Dropdown Activeness button
===================== */
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

/*
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
*/
/* =====================
Dropdown activeness with map changing
===================== */
$("#demographics").click(function() {
  map.removeControl(activelegend);
  map.removeControl(suitlegend);
  map.removeControl(commerlegend);
  map.removeControl(translegend);
  map.removeControl(demandlegend);
  map.removeControl(slopelegend);
  map.removeControl(contaminationlegend);
  map.removeControl(landuselegend);
  map.removeControl(floodlegend);

  map.removeLayer(featureGroup);
      featureGroup = L.geoJson(hex, {
        style: demostyle,
    }).addTo(map);
  demolegend.addTo(map);
});

$("#commercial").click(function() {
  map.removeControl(activelegend);
  map.removeControl(suitlegend);
  map.removeControl(demolegend);
  map.removeControl(translegend);
  map.removeControl(demandlegend);
  map.removeControl(slopelegend);
  map.removeControl(contaminationlegend);
  map.removeControl(landuselegend);
  map.removeControl(floodlegend);

  map.removeLayer(featureGroup);
      featureGroup = L.geoJson(hex, {
        style: commerstyle
    }).addTo(map);
  commerlegend.addTo(map);
});

$("#transportation").click(function() {
  map.removeControl(activelegend);
  map.removeControl(suitlegend);
  map.removeControl(demolegend);
  map.removeControl(commerlegend);
  map.removeControl(demandlegend);
  map.removeControl(slopelegend);
  map.removeControl(contaminationlegend);
  map.removeControl(landuselegend);
  map.removeControl(floodlegend);

  map.removeLayer(featureGroup);
      featureGroup = L.geoJson(hex, {
        style: transtyle
    }).addTo(map);
  translegend.addTo(map);
});

$("#demand").click(function() {
  map.removeControl(activelegend);
  map.removeControl(suitlegend);
  map.removeControl(demolegend);
  map.removeControl(commerlegend);
  map.removeControl(translegend);
  map.removeControl(slopelegend);
  map.removeControl(contaminationlegend);
  map.removeControl(landuselegend);
  map.removeControl(floodlegend);

  map.removeLayer(featureGroup);
      featureGroup = L.geoJson(hex, {
        style: demandstyle
    }).addTo(map);
    demandlegend.addTo(map);
});

/* =====================
Dropdown_suitability
===================== */

//style for suitability map 改！！！！！！！！！！
var slopecolor =function(d) {
    return d > 5.61   ? '#3f007d' :
           d > 3.86   ? '#54278f' :
           d > 2.83  ? '#6a51a3' :
           d > 2.11   ? '#807dba' :
           d > 1.52  ? '#9e9ac8' :
           d > 1.04  ? '#bcbddc' :
           d > 0.73   ? '#dadaeb' :
           d > 0.46   ? '#efedf5' :
           d > 0.17   ? '#f7fbff' :
                      '#fcfbfd';
}

var contaminationcolor =function(d) {
    return d > 8.26   ? '#000000' :
           d > 6.18   ? '#252525' :
           d > 4.29  ? '#525252' :
           d > 2.65   ? '#737373' :
           d > 1.80  ? '#969696' :
           d > 1.17  ? '#bdbdbd' :
           d > 0.67   ? '#d9d9d9' :
           d > 0.34   ? '#f0f0f0' :
           d > 0.13   ? '#fcfbfd' :
                      '#ffffff';
}

var landusecolor =function(d) {
    return d > 8.00   ? '#67001f' :
           d > 5.52   ? '#980043' :
           d > 3.46  ? '#ce1256' :
           d > 2.33   ? '#e7298a' :
           d > 1.34  ? '#df65b0' :
           d > 0.82  ? '#c994c7' :
           d > 0.48   ? '#d4b9da' :
           d > 0.26   ? '#e7e1ef' :
           d > 0.11   ? '#f7f4f9' :
                      '#fcfbfd';
}

var floodcolor =function(d) {
    return d > 7.74  ? '#08306b' :
           d > 6.94   ? '#08519c' :
           d > 5.95  ? '#2171b5' :
           d > 5.18   ? '#4292c6' :
           d > 4.02  ? '#6baed6' :
           d > 2.88  ? '#9ecae1' :
           d > 1.88   ? '#c6dbef' :
           d > 0.95   ? '#deebf7' :
           d > 0.36   ? '#f7fbff' :
                      '#fcfbfd';
}

var slopestyle = function(feature) {
    return {
        fillColor: slopecolor(feature.properties.slope_norm),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
};

var contaminationstyle = function(feature) {
    return {
        fillColor: contaminationcolor(feature.properties.cont_norm),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
};

var landusestyle = function(feature) {
    return {
        fillColor: landusecolor(feature.properties.land_norm),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
};

var floodstyle = function(feature) {
    return {
        fillColor: floodcolor(feature.properties.flood_norm),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
};

//build legend for four getElements
var slopelegend = L.control({position: 'bottomright'});
slopelegend.onAdd = function (map) {
    var diva = L.DomUtil.create('diva', 'slope legend'),
        grade = [0.00, 0.17, 0.46, 0.73, 1.04, 1.52, 2.11, 2.83, 3.86, 5.61],
        labels = [];
        for (var i = 0; i < grade.length; i++) {
              diva.innerHTML +=
                  '<i style="background:' + slopecolor(grade[i] + 0.01) + '"></i> ' +
                  grade[i] + (grade[i + 1] ? '&ndash;' + grade[i + 1] + '<br>' : '+');
          }
    return diva;
};

var contaminationlegend = L.control({position: 'bottomright'});
contaminationlegend.onAdd = function (map) {
    var diva = L.DomUtil.create('diva', 'contamination legend'),
        grade = [0.00, 0.13, 0.34, 0.67, 1.17, 1.80, 2.65, 4.29, 6.18, 8.26],
        labels = [];
        for (var i = 0; i < grade.length; i++) {
              diva.innerHTML +=
                  '<i style="background:' + contaminationcolor(grade[i] + 0.01) + '"></i> ' +
                  grade[i] + (grade[i + 1] ? '&ndash;' + grade[i + 1] + '<br>' : '+');
          }
    return diva;
};

var landuselegend = L.control({position: 'bottomright'});
landuselegend.onAdd = function (map) {
    var diva = L.DomUtil.create('diva', 'landuse legend'),
        grade = [0.00, 0.11, 0.26, 0.48, 0.82, 1.34, 2.33, 3.46, 5.52, 8.01],
        labels = [];
        for (var i = 0; i < grade.length; i++) {
              diva.innerHTML +=
                  '<i style="background:' + landusecolor(grade[i] + 0.01) + '"></i> ' +
                  grade[i] + (grade[i + 1] ? '&ndash;' + grade[i + 1] + '<br>' : '+');
          }
    return diva;
};

var floodlegend = L.control({position: 'bottomright'});
floodlegend.onAdd = function (map) {
    var diva = L.DomUtil.create('diva', 'flood legend'),
        grade = [0.00, 0.36, 0.95, 1.88, 2.88, 4.02, 5.18, 5.95, 6.94, 7.74],
        labels = [];
        for (var i = 0; i < grade.length; i++) {
              diva.innerHTML +=
                  '<i style="background:' + floodcolor(grade[i] + 0.01) + '"></i> ' +
                  grade[i] + (grade[i + 1] ? '&ndash;' + grade[i + 1] + '<br>' : '+');
          }
    return diva;
};

/* =====================
Dropdown Suitablity button
===================== */
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunctionsuit() {
  document.getElementById("myDropdownsuit").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
/*
window.onclick = function(event) {
  if (!event.target.matches('.suitdropbtn')) {
    var dropdowns = document.getElementsByClassName("suitdropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
*/
/* =====================
Dropdown with suitability map changing
===================== */
$("#slope").click(function() {
  map.removeControl(activelegend);
  map.removeControl(suitlegend);
  map.removeControl(demolegend);
  map.removeControl(commerlegend);
  map.removeControl(translegend);
  map.removeControl(demandlegend);
  map.removeControl(contaminationlegend);
  map.removeControl(landuselegend);
  map.removeControl(floodlegend);

  map.removeLayer(featureGroup);
      featureGroup = L.geoJson(hex, {
        style: slopestyle,
    }).addTo(map);
  slopelegend.addTo(map);
});

$("#contamination").click(function() {
  map.removeControl(activelegend);
  map.removeControl(suitlegend);
  map.removeControl(demolegend);
  map.removeControl(commerlegend);
  map.removeControl(translegend);
  map.removeControl(demandlegend);
  map.removeControl(slopelegend);
  map.removeControl(landuselegend);
  map.removeControl(floodlegend);

  map.removeLayer(featureGroup);
      featureGroup = L.geoJson(hex, {
        style: contaminationstyle
    }).addTo(map);
  contaminationlegend.addTo(map);
});

$("#landuse").click(function() {
  map.removeControl(activelegend);
  map.removeControl(suitlegend);
  map.removeControl(demolegend);
  map.removeControl(commerlegend);
  map.removeControl(translegend);
  map.removeControl(demandlegend);
  map.removeControl(slopelegend);
  map.removeControl(contaminationlegend);
  map.removeControl(floodlegend);

  map.removeLayer(featureGroup);
      featureGroup = L.geoJson(hex, {
        style: landusestyle
    }).addTo(map);
  landuselegend.addTo(map);
});

$("#flood").click(function() {
  map.removeControl(activelegend);
  map.removeControl(suitlegend);
  map.removeControl(demolegend);
  map.removeControl(commerlegend);
  map.removeControl(translegend);
  map.removeControl(demandlegend);
  map.removeControl(slopelegend);
  map.removeControl(contaminationlegend);
  map.removeControl(landuselegend);

  map.removeLayer(featureGroup);
      featureGroup = L.geoJson(hex, {
        style: floodstyle
    }).addTo(map);
  floodlegend.addTo(map);
});

/* =====================
Infrastructure
===================== */
// Checkbox
var infra_check;
// load the infrasturcture development location area
var infra_checkbox = function(){
  $(document).ready(function() {
        $.ajax(infrustructure).done(function(data) {
          var parsedData = JSON.parse(data);
          infra_check = L.geoJson(parsedData, {
            style: infraStyle,
            onEachFeature: forEachFeature,
        });
        });
      });
};
infra_checkbox();

// load the community center
var center_show;
var center_load = function(){
    $(document).ready(function() {
            $.ajax(communityC).done(function(data) {
              var parsedData = JSON.parse(data);
             center_show = L.geoJson(parsedData, { pointToLayer: function (feature, latlng) {
              return L.circleMarker(latlng, geojsonMarkerOptions);
              },
              onEachFeature:forEachFeature_center,
            });
            });
          });
};
center_load();

// Set the various check condition and the corresponding mapping Change
function is_checked(){
  var grocery = document.getElementById("grocery").checked;
  var health = document.getElementById("health").checked;
  var library = document.getElementById("library").checked;

  if(grocery == true && health == false && library == false){
    map.removeLayer(featureGroup);
    infra_check = L.geoJson(infraLocation, {
      style: infraStyle,
      filter: myFilterGroecry,
      onEachFeature: forEachFeature,
  }).addTo(map);
    featureGroup=L.layerGroup([infra_check,center]).addTo(map);
}

  else if(health == true && grocery == false &&  library == false){
    map.removeLayer(featureGroup);
    infra_check = L.geoJson(infraLocation, {
      style: infraStyle,
      filter: myFilterHealth,
      onEachFeature: forEachFeature,
  }).addTo(map);
    featureGroup=L.layerGroup([infra_check,center]).addTo(map);
}


  else if(library == true && grocery == false && health == false){
    map.removeLayer(featureGroup);
    infra_check = L.geoJson(infraLocation, {
      style: infraStyle,
      filter: myFilterLibrary,
      onEachFeature: forEachFeature,
  }).addTo(map);
    featureGroup=L.layerGroup([infra_check,center]).addTo(map);
}


  else if(health == true && grocery == true && library == false){
    map.removeLayer(featureGroup);
    infra_check = L.geoJson(infraLocation, {
      style: infraStyle,
      filter: myFilterGroecryHealth,
      onEachFeature: forEachFeature,
  }).addTo(map);
    featureGroup=L.layerGroup([infra_check,center]).addTo(map);
}

  else if(health == true && grocery == false && library == true){
    map.removeLayer(featureGroup);
    infra_check = L.geoJson(infraLocation, {
      style: infraStyle,
      filter: myFilterHealthLibrary,
      onEachFeature: forEachFeature,
  }).addTo(map);
    featureGroup=L.layerGroup([infra_check,center]).addTo(map);
}

  else if(health == false && grocery == true && library == true){
    map.removeLayer(featureGroup);
    infra_check = L.geoJson(infraLocation, {
      style: infraStyle,
      filter: myFilterGroceryLibrary,
      onEachFeature: forEachFeature,
  }).addTo(map);
    featureGroup=L.layerGroup([infra_check,center]).addTo(map);
}

  else if(health == true && grocery == true &&  library == true){
    map.removeLayer(featureGroup);
    infra_check = L.geoJson(infraLocation, {
      style: infraStyle,
      onEachFeature: forEachFeature,
  }).addTo(map);
    featureGroup=L.layerGroup([infra_check,center]).addTo(map);
}

  else if(health == false && grocery == false &&  library == false){
    map.removeLayer(featureGroup);

    var featureGroup1=L.layerGroup([infra]).addTo(map);
    var featureGroup2=L.layerGroup([center]).addTo(map);
    featureGroup=L.layerGroup([infra,center]).addTo(map);
}
}
// filter the polygons with the Grocery, Health, Library
var myFilterGroecry = function(feature) {
    if(feature.properties.facility_t === 'grocery'){return true;}
    };

var myFilterHealth= function(feature) {
    if(feature.properties.facility_t === 'health'){return true;}
    };

var myFilterLibrary= function(feature) {
    if(feature.properties.facility_t === 'library'){return true;}
    };

var myFilterGroecryHealth = function(feature) {
    if(feature.properties.facility_t === 'grocery'){return true;}
    else if(feature.properties.facility_t === 'health'){return true;}
    };
var myFilterHealthLibrary = function(feature) {
    if(feature.properties.facility_t === 'library'){return true;}
    else if(feature.properties.facility_t === 'health'){return true;}
    };

var myFilterGroceryLibrary = function(feature) {
    if(feature.properties.facility_t === 'library'){return true;}
    else if(feature.properties.facility_t === 'grocery'){return true;}
    };

// Style of infrastructure
var infraStyle = function(feature) {
      switch (feature.properties.facility_t){
      case 'grocery': return {color: "#a1dab4",weight:1.2,fillColor:"#a1dab4",fillOpacity:0.8};
      case 'health': return {color: "#41b6c4",weight:1.2,fillColor:"#41b6c4",fillOpacity:0.8};
      case 'library': return {color: "#2c7fb8",weight:1.2,fillColor:"#2c7fb8",fillOpacity:0.8};
      }
  };

// Click the checkbox
$('#grocery').click(function(e) {
          is_checked();
    });
$('#health').click(function(e) {
          is_checked();
    });
$('#library').click(function(e) {
          is_checked();
    });
// Click the reset map button
$('#doFilter').click(function() {
  loadinfra();
  document.getElementById("grocery").checked = false;
  document.getElementById("health").checked = false;
  document.getElementById("library").checked = false;
}).get();

/* =====================
Dropdown community Center button
===================== */
// Dropdown styles
function myFunction2() {
  document.getElementById("myDropdown2").classList.toggle("show");
}
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn2')) {
    var dropdowns = document.getElementsByClassName("dropdown-content2");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput2");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown2");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

//Click different community in the dropdown & show information in the sidebar
$("#Id0").click(function() {
  map.removeLayer(featureGroup);
  featureGroup=L.layerGroup([center_show]).addTo(map);
  $('#develop_description').text("No new infrastructure development is needed.");
});

$("#Id2").click(function() {
  map.removeLayer(featureGroup);
  featureGroup=L.layerGroup([center_show]).addTo(map);
  $('#develop_description').text("No new infrastructure development is needed.");
});
$("#Id7").click(function() {
  map.removeLayer(featureGroup);
  featureGroup=L.layerGroup([center_show]).addTo(map);
  $('#develop_description').text("No new infrastructure development is needed.");
});
$("#Id8").click(function() {
  map.removeLayer(featureGroup);
  featureGroup=L.layerGroup([center_show]).addTo(map);
  $('#develop_description').text("No new infrastructure development is needed.");
});
$("#Id9").click(function() {
  map.removeLayer(featureGroup);
  featureGroup=L.layerGroup([center_show]).addTo(map);
  $('#develop_description').text("No new infrastructure development is needed.");
});


$("#Id1").click(function() {
  map.removeLayer(featureGroup);
  infra_check = L.geoJson(infraLocation, {
        filter: myFilterId1,
        style: infraStyle,
        onEachFeature: forEachFeature,
    }).addTo(map);
    featureGroup=L.layerGroup([infra_check,center_show]).addTo(map);
    $('#develop_description').text("A grocery store is needed here to serve community center 1.");
});

$("#Id3").click(function() {
  map.removeLayer(featureGroup);
  infra_check = L.geoJson(infraLocation, {
        filter: myFilterId3,
        style: infraStyle,
        onEachFeature: forEachFeature,
    }).addTo(map);
  featureGroup=L.layerGroup([infra_check,center_show]).addTo(map);
  $('#develop_description').text("A public library, a grocery store,and a public heath institution is needed here to serve community center 3");
});

$("#Id4").click(function() {
  map.removeLayer(featureGroup);
  infra_check= L.geoJson(infraLocation, {
        filter: myFilterId4,
        style: infraStyle,
        onEachFeature: forEachFeature,
    }).addTo(map);
  featureGroup=L.layerGroup([infra_check,center_show]).addTo(map);
  $('#develop_description').text("A grocery store is needed here to serve community center 4");
});

$("#Id5").click(function() {
  map.removeLayer(featureGroup);
  infra_check = L.geoJson(infraLocation, {
        filter: myFilterId5,
        style: infraStyle,
        onEachFeature: forEachFeature,
    }).addTo(map);
  featureGroup=L.layerGroup([infra_check,center_show]).addTo(map);
  $('#develop_description').text("A public health institution is needed here to serve community center 5");
});

$("#Id6").click(function() {
  map.removeLayer(featureGroup);
  infra_check = L.geoJson(infraLocation, {
        filter: myFilterId6,
        style: infraStyle,
        onEachFeature: forEachFeature,
    }).addTo(map);
  featureGroup=L.layerGroup([infra_check,center_show]).addTo(map);
  $('#develop_description').text("A grocery store is needed here to serve community center 6");
});
$("#Id10").click(function() {
  map.removeLayer(featureGroup);
  infra_check= L.geoJson(infraLocation, {
        filter: myFilterId10,
        style: infraStyle,
        onEachFeature: forEachFeature,
    }).addTo(map);
  featureGroup=L.layerGroup([infra_check,center_show]).addTo(map);
  $('#develop_description').text("A grocery store is needed here to serve community center 10");
});
$("#Id11").click(function() {
  map.removeLayer(featureGroup);
  infra_check = L.geoJson(infraLocation, {
        filter: myFilterId11,
        style: infraStyle,
        onEachFeature: forEachFeature,
    }).addTo(map);
  featureGroup=L.layerGroup([infra_check,center_show]).addTo(map);
  $('#develop_description').text("A public library is needed here to serve community center 11.");
});

$("#Id12").click(function() {
  map.removeLayer(featureGroup);
  infra_check= L.geoJson(infraLocation, {
        filter: myFilterId12,
        style: infraStyle,
        onEachFeature: forEachFeature,
    }).addTo(map);
  featureGroup=L.layerGroup([infra_check,center_show]).addTo(map);
  $('#develop_description').text("A grocery store is needed here to serve community center 12.");
});

// Filter the community center
var myFilterId1 = function(feature){
  if(feature.properties.id === '1'){return true;}
};
var myFilterId3 = function(feature){
  if(feature.properties.id === '3'){return true;}
};
var myFilterId4 = function(feature){
  if(feature.properties.id === '4'){return true;}
};
var myFilterId5 = function(feature){
  if(feature.properties.id === '5'){return true;}
};
var myFilterId6 = function(feature){
  if(feature.properties.id === '6'){return true;}
};
var myFilterId10 = function(feature){
  if(feature.properties.id === '10'){return true;}
};
var myFilterId11 = function(feature){
  if(feature.properties.id === '11'){return true;}
};
var myFilterId12 = function(feature){
  if(feature.properties.id === '12'){return true;}
};
