d3.quakeMap = function(options) {

  var mapDivTag = options.mapDivTag === undefined ? 'map' : options.mapDivTag
    , quakeEndDate = options.quakeEndDate === undefined ? new Date() : options.quakeEndDate
    , numDays = options.numDays < 1 ? 1 : options.numDays // number of days worth of earthquakes to display
    , mapCenter = options.mapCenter === undefined ? [47.598877, -122.330916] : options.mapCenter
    , mapZoomLevel = options.mapZoomLevel === undefined ? 5 : options.mapZoomLevel
    , timeOut = null // timeout function to prevent map from repeatedly updating upon resize
    // --- leaflet stuff ---
    , leafletmap // the leaflet map
    // --- D3 stuff ---
    , svg // save a selection for the svg within the map
    , path // used to collect the bounding box, in svg space, of objects on the map
    // color scale for the earthquakes
    // color scale from: http://colorbrewer2.org/?type=sequential&scheme=OrRd&n=9
    , eqDomain = [-1, 0, 1, 2, 3, 4, 5, 6, 9 ]
    , eqColorScale = d3.scaleLinear()
                         .domain(eqDomain)
                         .range(['#fff7ec','#fee8c8',
                               '#fdd49e','#fdbb84',
                               '#fc8d59','#ef6548',
                                 '#d7301f','#b30000','#7f0000'
                                ])
    // size scale for earthquakes
    , eqSizeScale = d3.scaleLinear()
                      .domain(eqDomain)
                      .range([1,1,1.5,3,4.5,6,7.5,9,13.5]);

  function removeEarthquakeCircles() {
    // because we're doing a time series, we must remove all of the existing
    // earthquakes in order for the time sequence to be valid
    svg.select("g")
        .selectAll("circle")
        .remove();
  }

  function my() {
    
    // DRAW EARTHQUAKES 
    var eqQuery = earthquakeURLMapBounds(86400 * numDays); // 86400 seconds = 1 day, so query for past day's earthquakes
    d3.json(eqQuery, function(err, json) {
     if (err) {
        throw err;
      }
      
      // Filter out any data with no geometry info 
      var earthquakes = json.features.filter(
        function(d) {
          return d.geometry !== null;
        }
      );
      
      if( earthquakes.length < 1 )
        return;
      
      // get the bounding box of all of the earthquakes in the selection
      // the bounds function utilizes the transform we created above
      // to get the bounding box of the earthquakes.
      //  -> notice that the bounding box is in SVG coordinates <-
      var bounds = path.bounds(json);
      
      // we need to add some padding around the SVG to allow for the
      // extra radius of the earthquake's size scale, otherwise
      // earthquake circles will be cut off near the edges of the SVG
      // we'll use the largest earthquake size to govern this padding value
      var svgPadding = d3.max(eqSizeScale.range()) * 1.10;  
      
      // get the top left and bottom right as [x,y] arrays,
      // AND add in some padding to allow for the extra earthquake scale
      // (this is is basically growing the bounding box by svgPadding on all sides)
      var topLeft = [ bounds[0][0] - svgPadding, bounds[0][1] - svgPadding ] 
        , bottomRight = [ bounds[1][0] + svgPadding, bounds[1][1] + svgPadding ]
      
      // set the width, height, top, and left of the svg to position it
      svg.attr("width", bottomRight[0] - topLeft[0] )
        .attr("height", bottomRight[1] - topLeft[1] )
        .style("left", topLeft[0] + "px")
        .style("top", topLeft[1] + "px");
      
      // add the new earthquake series
      svg.select("g")
        .selectAll("circle")
          .data(earthquakes, function(d) { return d.id; })
        .enter()
          .append("circle")
          // here we translate LOCALLY within the svg, and, of course, we have to add the padding value to
          .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")")
          .attr("class", "earthquake")
          .attr("cx", function(d) {
                        var ll = L.latLng(d.geometry.coordinates[1],d.geometry.coordinates[0]);
                        return leafletmap.latLngToLayerPoint(ll).x; })
          .attr("cy", function(d) {
                        var ll = L.latLng(d.geometry.coordinates[1],d.geometry.coordinates[0]);
                        return leafletmap.latLngToLayerPoint(ll).y; })
          .attr("r", 0)
          .transition()
          .duration(500)
          .delay(function(d,i){ return 200*i; })
          .ease(d3.easeElastic)
          .attr("r", function(d) {
                return eqSizeScale(d.properties.mag);
              }) 
          .style("fill", function(d) {
                  return eqColorScale(d.properties.mag);
              });
    });      
  }

  // get/set the leaflet map
  my.leafletmap = function(value) {
    if( !arguments.length ) return leafletmap;

    leafletmap = value;
    return my;
  };

  // edit the last day of quake values 
  my.quakeEndDate = function(value) {
    if( !arguments.length ) return quakeEndDate;

    quakeEndDate = value;
    if( typeof onMapMoveZoom === 'function' ) onMapMoveZoom();

    return my;
  };

  // edit the number of days for the active chart
  my.numDays = function(value) {
    if( !arguments.length ) return numDays;

    numDays = value;
    if( typeof onMapMoveZoom === 'function' ) onMapMoveZoom();

    return my;
  };

  my.mapCenter = function(value) {
    if( !arguments.length ) return mapCenter;

    mapCenter = value;
    if( leafletmap !== undefined ) {
      leafletmap.flyTo(mapCenter,mapZoomLevel,
                          { "animate": true,
                          "pan": {
                              "duration": 5 
                            }
                          }
                        );
    }
    return my;
  };

  my.mapZoomLevel = function(value) {
    if( !arguments.length ) return mapZoomLevel;

    mapZoomLevel = value;
    if( leafletmap !== undefined ) {
      leafletmap.flyTo(mapCenter,mapZoomLevel,
                          { "animate": true,
                          "pan": {
                              "duration": 5 
                            }
                          }
                        );
    }

    return my;
  };

  // function using leaflet's functions to convert from lat/long to points in the map
  // we do this to allow leaflet to govern the map projection, which we will overlay
  // points/vectors onto
  function projectPoint(x, y) {
     var point = leafletmap.latLngToLayerPoint(new L.LatLng(y, x));
     this.stream.point(point.x, point.y);
  }

  // builds a magnitude legend on top of a legend SVG
  function addMagnitudeLegend()
  {
    d3.select("#mapLegend")
      .remove(); // select any old map legend and remove it
    
    // create a list of objects representing a legend entry
    // so we can add x,y coordinates to each object and apply text
    // to each magnitude circle:
    // example here: http://stackoverflow.com/questions/11857615/placing-labels-at-the-center-of-nodes-in-d3-js
    var legendObjs = [];
    eqDomain.forEach(function(d,i) {
       legendObjs[i] = { mag: d };
    });
    
    // some sizing and location info
    var lNodeSize = 40;
    var lPadding = 5;
    var legendWidth = (legendObjs.length * (lNodeSize + 1));
    var legendHeight = lNodeSize * 1.5;
    var lTopLeft = [lPadding, window.innerHeight - legendHeight ]; 
    var lBottomRight = [lTopLeft[0] + legendWidth, lTopLeft[1] + legendHeight]; 

    // get the legend pane that we created from the leaflet map
    var mapLegendDiv = d3.select("#"+mapDivTag) // select the map div
                          .append("div") // append a new div inside that map
                          .attr("id","mapLegend"); // make the id of the new map div 'mapLegend'

    // add a new svg element to the map legend div we created
    var legendsvg = mapLegendDiv.append("svg") // add a new svg to the map legend div
          .attr("class", "legend-pane")
          .attr("width", window.innerWidth  + "px")
          .attr("height", window.innerHeight + 2 * lPadding + "px");
    
    legendsvg.selectAll("g")
        .append("g");
    
    // add a bounding rectangle
    legendsvg.append("svg:rect")
        .attr("id", "eq-legend")
        .attr("class", "legend-box")
        .attr("width", legendWidth + "px")
        .attr("height", legendHeight + "px")
        .attr("transform","translate("+lTopLeft[0]+","+(2*lPadding+lTopLeft[1])+")");
     
    // append the data and get the enter selection
    var lnodes = legendsvg.append("svg:g")
        .selectAll("g") 
        .data(legendObjs, function(d,i){ return d.mag; })
        .enter();
            
    // append the circles to the enter selection
    lnodes.append("circle")
          .attr("r", function(d){ return eqSizeScale(d.mag); })
          .attr("id", "eq-legend")
          .attr("class", "earthquake")
          .style("fill", function(d){ return eqColorScale(d.mag); })
          .attr("transform", function(d, i) {
                                 d.x = lTopLeft[0] + (2 * lNodeSize / 3 + lNodeSize * i);
                                 d.y = lBottomRight[1] - lNodeSize / 2 + lPadding;
                                 return "translate("
                                          + d.x + ","+ d.y 
                                          + ")";
                              });
    // append the text to each "svg:g" node, which also contains a circle
    lnodes.append("text")
          .text(function(d) { return "M"+d.mag; })
          .attr("id", "eq-legend")
          .attr("class", "legend-mag-text")
          .attr("text-anchor", "middle" )
          // the transform here contains an offset from the
          // middle of the g element, which is also the middle of the circle
          .attr("transform", function(d) {
                                  return "translate("
                                     + d.x + ","
                                     + (d.y-15) + ")"; });
  }

  function buildLeafletMap() {
    // CREATE MAP
    // set view to Seattle Area 
    leafletmap = new L.map(mapDivTag) 
                    .setView(mapCenter,mapZoomLevel);
    leafletmap.options.maxZoom = 11;
    // min zoom set relatively low because USGS quake feed doesn't allow
    // spanning more than 360 degrees of longitude, which gets queried
    // when the view is zoomed way out
    leafletmap.options.minZoom = 3; 
    
    // background tile layer from: https://leaflet-extras.github.io/leaflet-providers/preview/
    var Esri_OceanBasemap =  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
      maxZoom: 13
    }).addTo(leafletmap);
    
    // append the SVG to the Leaflet map pane
    svg = d3.select(leafletmap.getPanes().overlayPane).append("svg")
            .attr("class", "leaflet-zoom-hide");
    // g (group) element will be inside the svg, and will contain the earthquakes
    svg.append("g")
       .attr("class", "leaflet-zoom-hide");
  }

  function earthquakeURLMapBounds(secondsSinceNow) {
    
    // set up an array of strings to form a query (will join later with ?'s)
    var query = [ "https://earthquake.usgs.gov/fdsnws/event/1/query&format=geojson" ];
    
    var endtime = quakeEndDate; 
    var starttime = new Date(endtime.getTime() - secondsSinceNow * 1000);
    
    query.push("starttime=" + starttime.toISOString() );
    query.push("endtime=" + endtime.toISOString() );
    
    var bnds = leafletmap.getBounds();
    
    var minLat = Math.min(bnds.getSouth(),bnds.getNorth());
    var maxLat = Math.max(bnds.getSouth(), bnds.getNorth());
    var minLong = Math.min(bnds.getEast(), bnds.getWest());
    var maxLong = Math.max(bnds.getEast(), bnds.getWest());
    query.push("minlatitude=" + minLat );
    query.push("maxlatitude=" + maxLat ); 
    query.push("minlongitude=" + minLong ); 
    query.push("maxlongitude=" + maxLong ); 
    
    query.push("orderby=time-asc"); // order in time ascending
    
    return query.join("&");
  }

  function onMapMoveZoom() {
    if (timeOut !== null)
      clearTimeout(timeOut);

    timeOut = setTimeout(function(){
      addMagnitudeLegend();
      my();
    }, 500);
  }

  function init() {
    //  create a d3.geo.path to convert GeoJSON to SVG (in d3 version 4, d3.geo.path becomes d3.geoPath)
    // this is used to calculate a bounding box for the earthquakes below
    var transform = d3.geoTransform({point: projectPoint});
    path = d3.geoPath().projection(transform);

    buildLeafletMap();

    // Re-draw on reset, this keeps the markers where they should be on reset/zoom
    leafletmap.on("moveend", onMapMoveZoom);
    leafletmap.on("movestart", removeEarthquakeCircles);

    // add some earthquakes!
    onMapMoveZoom();
  }

  // build the base level map!
  init();

  return my;
};

