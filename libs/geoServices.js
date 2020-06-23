
//-----------------------------------------------------------------
// Functions related to OSM
//-----------------------------------------------------------------

// may be called on osrm standard demo server : router.project-osrm.org

function osrm_table(serie, server) {
	// Query construction
	var service = "http://" + server + "/table/v1/driving/";
	var options = "";
	var query = service + serie + options;
	var answer_tmp_file = "answer_osrm.json";
	var fullquery = "curl '" + query + "' >" + answer_tmp_file;
	// writeln("INFO : fullquery = ", fullquery);
	// Calls a subprocess 
	IloOplExec("curl '" + query + "' >" + answer_tmp_file);
	// Reads the result 
	var answerString = file_to_string(answer_tmp_file);
	//writeln(answerString);
	// Parse the JSON string into an script Object
	var answer = parseSimpleJSON(answerString);
	if (typeof answer == "undefined") {
		writeln("ERROR : unable to convert OSMR answer.");
			// toto - wait for a while and try again
	} else if (answer["\"code\""] != "Ok") {
		writeln("WARNING : unable to retrieve durations from OSMR answer");		
			// toto - wait for a while and try again
	} 
	return answer;

}

//-----------------------------------------------------------------
// Functions related to Nominatim  (TODO if you want)
//-----------------------------------------------------------------

