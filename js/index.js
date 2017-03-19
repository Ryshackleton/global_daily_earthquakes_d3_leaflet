var numDays = 7;

d3.select('#numberOfDays').text(numDays);

// build the quake map!
var options = {
  mapDivTag: 'theMap',
  numDays: numDays 
};

var quakemap = new d3.quakeMap(options);

