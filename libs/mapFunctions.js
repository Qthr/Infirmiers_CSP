// Author Ph. Chatalic

// Writes a js file containing data extrated from the solution for visualization on a map
function generate_data_for_vizualization(mapCenterLat,mapCenterLong,zoomLevel,cost,steps,pois,stepsAtPOIs,modelName) {
	var result_file = "dataVis.js";
	var path_file = "../visualization/" + result_file;
	var fo = new IloOplOutputFile(path_file);
	fo.writeln("// Données générées à partir de la solution produite pour l'instance ",thisOplModel.instance.name);
	fo.writeln("// à l'aide du modèle ",modelName,"");
	fo.writeln("var instanceName = \"",thisOplModel.instance.name,"\";");
	fo.writeln("var modelName = \"",modelName,"\";");
	fo.writeln("var mapCenter = [",mapCenterLat,",",mapCenterLong,"];");
	fo.writeln("var zoomLevel = ",zoomLevel,";");
	fo.writeln("var optimum = ",cost,";");
	write_plannings(fo,steps);
	write_steps_at_poi(fo,pois,stepsAtPOIs);		
}	

// Write the data corresponding to the respective plannings steps for each nurse
function write_plannings(fo,steps) {
	var plannings = new Object();
	for (var s in steps)  {
		var inf = s.infirmiere;
		if (plannings[inf] == "undefined"){
			plannings[inf] = new Array();
		}
	    plannings[inf][s.etape] = stepToJSObject(s);
	}	
	fo.writeln("var plannings = ", value2JSON(plannings),";");
}

// Writes the data corresponding to planning steps, grouped by geographic point of interest
// into a Array
function write_steps_at_poi(fo,pois,stepsAtPOIs) {
	var POIs = new Array();
	var poiIdx = 0;
	for (var p in pois) {
		 var poi = new Object();
		 poi.latitude = p.latitude;
		 poi.longitude = p.longitude;
		 poi.steps = new Array();
		 for (var s in stepsAtPOIs[p]) {
			insertStepChorono(stepToJSObject(s),poi.steps);
		 }
		 POIs[poiIdx] = poi;
		 poiIdx++;
	}
	fo.writeln("var poisVisits = ", value2JSON(POIs),";");
}		
	
// Convert a planning step (Etape) into a corresponding a script Object
function stepToJSObject(step) {
	var js = new Object();
	js.order = step.etape;
	js.nurse = step.infirmiere;
	js.place = step.visite;
	js.address = step.adresse;
	js.latitude = step.latitude;
	js.longitude = step.longitude;
	js.description = step.description;
	js.start = step.debut;
	js.stepLength = step.duree;
	js.end = step.fin;
	js.transit = step.transit;
//	writeln("DEBUG [stepToJSObject]: s = ",s);
//	writeln("DEBUG [stepToJSObject]: value2JSON(s) = ",value2JSON(s));
	return js;
}


// Insert a step chronologically in to an array of steps
function insertStepChorono(step,arrayOfSteps) {
	var arrayLength = arrayOfSteps.length;
	var insertionIdx = 0;
 	if(insertionIdx < arrayLength) {
		while (insertionIdx < arrayLength && arrayOfSteps[insertionIdx].start < step.start)
			insertionIdx++;
		if(insertionIdx < arrayLength) {
			// folowing values have to be shifted by one in the array
			for(var oidx = arrayLength; oidx > insertionIdx ; oidx--) 
				arrayOfSteps[oidx]  = arrayOfSteps[oidx - 1];
		}
	}	
	arrayOfSteps[insertionIdx] = step;
	return;
}

				
