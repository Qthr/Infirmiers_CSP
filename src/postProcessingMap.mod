// ========= Producing data for the map display  ========= 
// This part assumes that the following variables have been previously defined : 
// string modelName = ....;		
// int optimum = ....;		
// {Etape} steps = ....;		

execute{
	includeScript("../libs/mapFunctions.js");
}


// Computing the values defining the coordinates of the map of interest
// including all points of interest (POIs)
float minLong = min (s in steps) s.longitude;
float maxLong = max (s in steps) s.longitude;
float minLat = min (s in steps)  s.latitude;
float maxLat = max (s in steps)  s.latitude;

// Enlargement facor
float displayMarginPercent = 1.02; 

// Slightly enlarge the map width to avoid having a POI right at the border or the map
float mapLongWidth = (maxLong-minLong)*displayMarginPercent;

// Computing of the cernter of the map
float mapCenterLong = minLong + (maxLong-minLong)/2;
float mapCenterLat = minLat + (maxLat-minLat)/2;

//float mapCenter[0..1] = [mapCenterLong,mapCenterLat];

// Computing the appropriate zoom level according to the map width

range zoomLevels = 0..19;

//-----------------------------------
// ZoomLevel angles Table extracts from https://wiki.openstreetmap.org/wiki/Zoom_levels
float longAngle[zoomLevels] = [
	360.0, 
	180.0, 
	90.0, 
	45.0, 
	22.5,
	11.25, 
	6.625,
	2.813,
	1.406,
	0.703,
	0.352,
	0.176,
	0.088,
	0.044,
	0.022,
	0.011,
	0.005,
	0.003,
	0.001,
	0.0005
];
//-----------------------------------

// Initial zoomLevel of the map
int zoomLevel;


execute{
	zoomLevel = 19;
	while (longAngle[zoomLevel] < mapLongWidth)
		zoomLevel--;
	zoomLevel++;
	writeln("Info : mapCenter =  [",mapCenterLong,",",mapCenterLat,"]");	
	writeln("Info : mapWidth = ", mapLongWidth);	
	writeln("Info : initial zoomLevel = ", zoomLevel);	
}


//-----------------------------------
// Generating the dataVis.js file
//-----------------------------------

// Computes the set of POIs of the map having the same geographic coordinates
{GeoPoint} mapPOIs = {<s.latitude,s.longitude> | s in steps};
       
// Group steps according to their geographic coordinates
{Etape} stepsAtPOI[p in mapPOIs] = {s | s in steps : s.latitude == p.latitude && s.longitude == p.longitude};
// Note : steps corresponding to different addresses but mapped to the same coordinates
// will be grouped togeather 

execute{
	// Export appropriate  data into a javascript file ()	
	generate_data_for_vizualization(mapCenterLat,mapCenterLong,zoomLevel,optimum,steps,mapPOIs,stepsAtPOI,modelName);
}

