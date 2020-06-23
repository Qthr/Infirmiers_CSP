// Caution :  More recent Javascript syntax
function  content_marker(steps) {
	//console.log("DEBUG:[content_marker] steps = ",steps);
	var markContent = "<markerContent>\n";
	var commonAddress = uniqueAddress(steps);	// return common address or null
	//console.log("DEBUG:[content_marker] commonAddress = ",commonAddress);
	if (commonAddress != null)
		markContent = markContent + "<address>" + smallAddress(commonAddress) + "</address> \n";	
	for(var vi = 0; vi < steps.length ; vi++) {
	//	console.log("DEBUG:[content_marker] vi = ",vi);
		var visit = steps[vi];
		markContent = markContent + "<mvisit>";
		markContent = markContent + "<schedule> <hhmm>"+ mn2hhmm(visit.start) + "</hhmm> : <place>" + visit.place.split("_").join(" ") + "</place>";
		if (uniqueAddress == null)
			markContent = markContent + "<address>" + smallAddress(visit.address) + "</address> \n";
		markContent = markContent + "</schedule>";
		markContent = markContent + "<description>" + visit.description +  " (<length>" + visit.stepLength + "</length>)";
		if (multipleNurses)
			markContent = markContent + " (<nurse>" + visit.nurse + "</nurse>)\n";		
		markContent = markContent + " </description> \n";
		markContent = markContent + "</mvisit> \n";
	}
	//console.log("DEBUG:[content_marker] markContent = ",markContent);	
	markContent = markContent + "</markerContent>\n";
 	//console.log("DEBUG:[content_marker] markContent = ",markContent);
   return markContent;

}

function hasMultipleNurses(plannings) {
	var nbOfNurses =0;
 	for (var n in plannings) {
 		if (n != "toString" && plannings[n].length>2)
 			nbOfNurses++;
 	}
 	return (nbOfNurses > 1);
}

function format_plannings(plannings,markerByCoord) {
	var result = "<plannings>\n";
	for (var n in plannings) {
		if (n != "toString")
			result = result + format_planning(n,plannings[n]); 
	}
	result = result + "</plannings>";
	return result;
	
}

function format_planning(nurse,planning) {
	var result = "";
	var nbSteps = planning.length;
	if (nbSteps > 2) {		// Otherwise, no patient is visited
		result = result + "<planning>\n";
		result = result + "<nurse>" + nurse + "</nurse>\n";
		for(var i =0 ; i < nbSteps ; i++) {
			result = result + format_visit(planning[i]);
			if (i < nbSteps-1) {
				result = result + "<transit> <hhmm>" + planning[i].transit +"</hhmm></transit>";
				var waitingTime = planning[i+1].start - (planning[i].end + planning[i].transit);
				if (waitingTime > 0) 
				result = result + "<attente>" + mn2hhmm(waitingTime) +"</attente>";
			}
		}
		result = result + "</planning>\n";
	}			
	return result;
}


function format_visit(step) {
	var result =	  "<visit onmouseenter='show_popup(" + step.latitude + "," + step.longitude  +" );'"  ;
	result = result + " onmouseleave='hide_popup(" + step.latitude + "," + step.longitude  +" );' >\n";
	result = result + "<order>" + step.order + "</order>  <place>" + step.place + "</place>\n" ;
	result = result + "  <address>" + step.address + "</address>\n" ;
	result = result + "  <schedule> <hhmm>" + mn2hhmm(step.start) +" </hhmm>";
	result = result + "</schedule>\n" ;
	result = result + "  <description>" + step.description + "</description>" 
	result = result + " (<length>" + step.stepLength +"</length>)\n";
	result = result + "</visit>\n";
	return result;
}


// Checks if all steps have the same address
// return the unique address or null if this is not the case
// NB : in OSM the database is not complete and for some streets all street numbers
// are mapped to the same coordinates
function uniqueAddress(steps) {
	// visits is an non empty array of steps Objects
	var firstAddress = steps[0].address;
	var sameAddress = true;
	for (var i = 1; i < steps.length && sameAddress ; i++)
		sameAddress = (firstAddress == steps[i].address);
	if (sameAddress)
		return firstAddress;
	else
		return null;
}

function smallAddress(address) {
	var	sa = address.split(",").join("<br/>");
	    sa = sa.replace("France", "");
	return sa;
}


function hasUniqueAddress(steps) {
	// visits is an non empty array of steps Objects
	var firstAddress = steps[0].address;
	var sameAddress = true;
	for (var i = 1; i < steps.length && sameAddress ; i++)
		sameAddress = (firstAddress == steps[i].address);
	return sameAddress;
}


function mn2m(mn) {
	return mn % 60;
}

function mn2h(mn) {
	return (mn - (mn % 60))/60;
}

function mn2hhmm(mn) {
	return "" + numToDD(mn2h(mn)) + "h" + numToDD(mn2m(mn));
}

function mn2h(mn) {
	return (mn - (mn % 60))/60;
}

function numToDD(n) {
	 if (n < 10)
	 	return "0" + n;
	 else
	 	return  "" + n;
}
