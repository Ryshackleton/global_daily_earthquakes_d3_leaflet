/*!
 * Module to build queries the USGS earthquake database using their REST API
 * https://earthquake.usgs.gov/fdsnws/event/1/
 */
var usgsQuery = (function(my) {
    var baseURL = 'https://earthquake.usgs.gov/fdsnws/event/1/query&format=geojson';

  /* params { endtime: end time as a UTC date string, if undefined, will default to current time
           numSeconds: total seconds desired in the feed going back in time (86400 seconds = 1 day),
                        -error string if numSeconds is less than 1
           leafletmap: the leaflet map to query for bounds info */
  my.earthquakeURLMapBoundsJSON = function( params ) {
    // undefined date signifies "now" as endtime
    if( params.endtime === undefined )
      params.endtime = new Date();
    if( params.numSeconds < 1 )
      throw new TypeError({ fileName: "usgsQuery.js", message: "earthquakeURLMapBounds(params) - params.numSeconds must be greater than 1" });

    var starttime = new Date(params.endtime.getTime() - params.numSeconds * 1000 ); // convert milliseconds to seconds
    
    // set up an array of strings to form a query (will join later with ?'s)
    var query = [ baseURL ];
    
    query.push("starttime=" + starttime.toISOString() );
    query.push("endtime=" + params.endtime.toISOString() );
    
    if( params.leafletmap === undefined )
      throw new TypeError({ fileName: "usgsQuery.js", message: "earthquakeURLMapBounds(params) - params.leafletmap undefined" });

    var bnds = params.leafletmap.getBounds();
    
    var minLat = Math.min(bnds.getSouth(),bnds.getNorth());
    var maxLat = Math.max(bnds.getSouth(), bnds.getNorth());
    var minLong = Math.min(bnds.getEast(), bnds.getWest());
    var maxLong = Math.max(bnds.getEast(), bnds.getWest());
    query.push("minlatitude=" + minLat );
    query.push("maxlatitude=" + maxLat ); 
    query.push("minlongitude=" + minLong ); 
    query.push("maxlongitude=" + maxLong ); 
    query.push("eventtype=" + params.eventType);
    
    query.push("orderby=time-asc"); // order in time ascending
    
    return query.join("&");
  };

  return my;

})(usgsQuery || {});

