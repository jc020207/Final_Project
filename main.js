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
var infra;
var center;

/* =====================
Custom symbols and styles
===================== */

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

var introstyle = function(feature) {
    return {
        fillColor: '#ffffff',
        weight: 0.5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.5
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
    $.ajax(hexmap).done(function(data) {
      var parsedData = JSON.parse(data);
      featureGroup = L.geoJson(parsedData, {
      style:introstyle
    }).addTo(map);
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
  var loadintro = function(slide) {
    //remove previous layer when load
    map.removeLayer(featureGroup);
    //load slides
    $(document).ready(function() {
      $.ajax(hexmap).done(function(data) {
        var parsedData = JSON.parse(data);
        featureGroup = L.geoJson(parsedData, {
        style:introstyle
      }).addTo(map);
      });});
};


// load activeness layer
var loadact = function(slide) {
  //remove previous layer when load
  map.removeControl(suitlegend);
  map.removeLayer(featureGroup);
  //load slides
  $(document).ready(function() {
    $.ajax(hexmap).done(function(data) {
      var parsedData = JSON.parse(data);
      featureGroup = L.geoJson(parsedData, {
      style: activestyle
    }).addTo(map);
    featureGroup.eachLayer(getactivechartdata);
    });
    activelegend.addTo(map);
  });};


// load suitabiltiy layer
  var loadsuit = function(slide) {
    //remove previous layer when load
    map.removeControl(activelegend);
    map.removeLayer(featureGroup);
    //load slides
    $(document).ready(function() {
      $.ajax(hexmap).done(function(data) {
        var parsedData = JSON.parse(data);
        featureGroup = L.geoJson(parsedData, {
        style:suitstyle
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
});}

// run the function to load both layers
loadboth();

// map both infrastructure and community center
  var loadinfra = function(slide) {
      //remove previous layer when load
      map.removeControl(suitlegend);
      map.removeControl(activelegend);
      map.removeLayer(featureGroup);
      //load slides
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
      map.removeLayer(featureGroup);
      //load slides
      $(document).ready(function() {
        $.ajax(hexmap).done(function(data) {
          var parsedData = JSON.parse(data);
          featureGroup = L.geoJson(parsedData, {
          style: activestyle,
          filter: activeslidefilter
        }).addTo(map);
        featureGroup.eachLayer(getactivechartdata);
        });
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
          map.removeLayer(featureGroup);
          //load slides
          $(document).ready(function() {
            $.ajax(hexmap).done(function(data) {
              var parsedData = JSON.parse(data);
              featureGroup = L.geoJson(parsedData, {
              style: suitstyle,
              filter: suitslidefilter,
            }).addTo(map);
            featureGroup.eachLayer(getsuitchartdata);
            });
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
