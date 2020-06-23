include "structuresResultat.mod";	// structures for expressing the result

// steps of the planning(s)
{Etape} steps = {};	// Plannings steps
int optimum = dureeTransitions;

execute {
	includeScript("../libs/result.js");
	
	var optimum = dureeTransitions;
	var infirmiere = Opl.first(infirmieres).nom;
	var tempsCourant = journee.infJ;
    for(var i=0; i<nbEtapes; i++){
        var adresse = adresseParId[Position[i]];
        var soins = soinParId[Action[i]];
        writeln(infirmiere+"/"+i+"/"+adresse.nom+"/"+adresse.adresse+"/"+adresse.latitude+"/"+adresse.longitude+"/"+soins.codes+"/"+tempsCourant+"/"+soins.duree+"/"+(tempsCourant+soins.duree)+"/"+Transition[i]);
		steps.add(infirmiere, i, adresse.nom, adresse.adresse, adresse.latitude, adresse.longitude, soins.codes, tempsCourant, soins.duree, tempsCourant+soins.duree, Transition[i]);
		tempsCourant += soins.duree + Transition[i];
		optimum += soins.duree;
    }
   save_result(optimum,steps,modelName);
}

include "structuresMap.mod";
include "postProcessingMap.mod";
