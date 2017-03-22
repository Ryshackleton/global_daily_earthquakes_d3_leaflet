// build a list of typical earthquake views
// with a label, lat/long zoom level, number of days,
// and end date
var quakeViews = [
    {
      divId: 'west-coast-now', 
      params: 
        {
          label: "Earthquakes in the last 24 hours",
          longlabel: "USGS Earthquake feed of earthquakes in the past 24 hours (without explosions or quarry blasts)" ,
          center: [41.991341, -115.782354],
          zoom: 5,
          days: 1,
          date: undefined,
          eventType: "earthquake"
        }
    }
    ,
    {
      divId: 'west-coast-week', 
      params: 
        {
          label: "Earthquakes in the past week",
          longlabel: "USGS Earthquake feed of earthquakes in the past 7 days (without explosions or quarry blasts)",
          center: [41.991341, -115.782354],
          zoom: 5,
          days: 7,
          date: undefined,
          eventType: "earthquake"
        }
    }
    ,
    {
      divId: 'west-coast-month', 
      params: 
        {
          label: "Earthquakes in the past month",
          longlabel: "USGS Earthquake feed of earthquakes in the past 30 days (without explosions or quarry blasts).",
          center: [41.991341, -115.782354],
          zoom: 5,
          days: 30,
          date: undefined,
          eventType: "earthquake"
        }
    }
    ,
    {
      divId: 'explosions-month', 
      params: 
        {
          label: "Explosions in the last month",
          longlabel: "Seismic events marked as 'explosions' by the USGS.",
          center: [41.991341, -115.782354],
          zoom: 5,
          days: 30,
          date: undefined,
          eventType: "explosion"
        }
    }
    ,
    {
      divId: 'quarry-explosions-month', 
      params: 
        {
          label: "Quarry blasts in the last month",
          longlabel: "Seismic events marked as 'quarry blast' by the USGS.",
          center: [41.991341, -115.782354],
          zoom: 5,
          days: 30,
          date: undefined,
          eventType: "quarry blast"
        }
    }
    ,
    {
      divId: 'valdivia-1960', 
      params: 
        {
          label: "1960 Chilean Earthquake",
          longlabel: "Magnitude 9.5 near Valdivia, Chile.  This is the largest ever earthquake recorded by modern instruments. This sequence displays the earthquake and the following 3 days",
          center: [-39.827338, -73.247785],
          zoom: 6,
          days: 4,
          date: "1960-05-25T23:59:59" ,
          eventType: "earthquake"
        }
    }
    ,
    {
      divId: 'great-alaska-1964', 
      params: 
        {
          label: "1964 Great Alaska Earthquake",
          longlabel: "Magnitude 9.2 rupture beneath Prince William Sound in southern Alaska on March 27, 1964 at 5:36pm local time. The earthquake rupture started approximately 25 km beneath the surface, with its epicenter about 6 miles (10 km) east of the mouth of College Fiord, 56 miles (90 km) west of Valdez and 75 miles (120 km) east of Anchorage. The earthquake lasted approximately 4.5 minutes and is the most powerful recorded earthquake in U.S. history. The following 3 days are shown to illustrate how the aftershock sequence.",
          link: "https://earthquake.usgs.gov/earthquakes/events/alaska1964/",
          center: [59.385651, -147.024957],
          zoom: 5,
          days: 4,
          date: "1964-03-28T23:59:59",
          eventType: "earthquake"
        }
    }
    ,
    {
      divId: 'sumatra-2004', 
      params: 
        {
          label: "2004 Sumatra/Indian Ocean Earthquake",
          longlabel: "Magnitude 9.1 00:58:53 UTC on 26 December, 2004 with the epicentre off the west coast of Sumatra, Indonesia. The undersea megathrust earthquake was caused when the Indian Plate was subducted by the Burma Plate and triggered a series of devastating tsunamis along the coasts of most landmasses bordering the Indian Ocean, killing 230,000–280,000 people in 14 countries, and inundating coastal communities with waves up to 30 metres (100 ft) high. It was one of the deadliest natural disasters in recorded history.",
          center: [7.655104, 94.012632],
          zoom: 6,
          days: 3,
          date: "2004-12-28T23:59:59",
          eventType: "earthquake"
        }
    }
    ,
    {
      divId: 'denali-fault-2002', 
      params: 
        {
          label: "2002 Denali Fault Earthquake",
          longlabel: "Magnitude 7.9 rupture on the Denali Fault in central Alaska. This quake and subsequent earthquakes ruptured a total fault length of 211 miles. The following 3 days are shown to illustrate how the rupture continued to propagate along the main strand of the Denali Fault",
          center: [62.006110, -146.780242],
          zoom: 6,
          days: 4,
          date: "2002-11-06T23:59:59",
          eventType: "earthquake"
        }
    }
  ];
