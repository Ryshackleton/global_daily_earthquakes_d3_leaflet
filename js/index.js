// quakeViews defined externally in quakeViews.js 

window.onload = function () {

  // build the quake map!
  var options = {
    mapDivTag: 'map-canvas',
    numDays: 1 
  };

  var quakemap = new d3.quakeMap(options);
  quakemap.init();

  // build a button and a click response for each view
  // (attached to a div with id='earthquake-view-list'
  var first = true;
  quakeViews.forEach(function(v){
    // get the div that holds the earthquake buttons
    d3.select('#earthquake-view-list')
            .append('div')
            .attr('class',"panel panel-default")
              .append('div')
                .attr('class', "panel-heading")
                .attr('id', v.divId)
                .append("a")
                  .attr("href","#")
                  .text(v.params.label);
                

    d3.select('#earthquake-view-list')
                .append("p")
                  .style("padding-left","5px") 
                  .text(v.params.longlabel);

    d3.select('#earthquake-view-list')
                .append("hr");

    d3.select("#"+v.divId)
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
    if( first === true ){
      d3.select("#"+v.divId).on('click')();
      first = false;
    }
  });

};

