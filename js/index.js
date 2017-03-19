// build the quake map!
var options = {
  mapDivTag: 'theMap',
  numDays: 1 
};

var quakemap = new d3.quakeMap(options);

// build a list of typical earthquake views
// with a label, lat/long zoom level, number of days,
// and end date
var quakeViews = [
    {
      divId: 'seattle-now', 
      params: 
        {
          label: "Earthquakes in the last 24 hours",
          center: [47.598877,-122.33091],
          zoom: 5,
          days: 1,
          date: undefined 
        }
    }
    ,
    {
      divId: 'seattle-week', 
      params: 
        {
          label: "Earthquakes in the past week",
          center: [47.598877,-122.33091],
          zoom: 5,
          days: 7,
          date: undefined 
        }
    }
    ,
    {
      divId: 'valdivia-1960', 
      params: 
        {
          label: "M9.5 1960 Chilean Earthquake and the following 3 days",
          center: [-39.827338, -73.247785],
          zoom: 6,
          days: 4,
          date: "1960-05-25T23:59:59" 
        }
    }
    ,
    {
      divId: 'denali-fault-2002', 
      params: 
        {
          label: "M7.9 2002 Denali Fault Earthquake and the following 3 days",
          center: [62.006110, -146.780242],
          zoom: 6,
          days: 4,
          date: "2002-11-06T23:59:59"
        }
    }
  ];

// build a button and a click response for each view
// (attached to a div with id='earthquake-view-list'
quakeViews.forEach(function(v){
  // get the div that holds the earthquake buttons
  d3.select('#earthquake-view-list')
          .append('button')
          .attr('id', v.divId)
          .text(v.params.label)
          .on('click', function()
                {
                  d3.select('#events-title')
                      .text(v.params.label);

                  var qDate = (v.params.date === undefined)
                            ? new Date() 
                            : new Date(v.params.date);

                  quakemap.mapCenter(v.params.center)
                          .mapZoomLevel(v.params.zoom)
                          .numDays(v.params.days)
                          .quakeEndDate(qDate);

                  });
});
