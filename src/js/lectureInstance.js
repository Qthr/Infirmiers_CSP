/************************
* Devoir IALC 2018-19 - M1 Miage App 
* Binome : POISSON Caroline, THERRE Quentin
*
* Fonctions de script utiles pour la lecture des fichiers d'instance
************************/

// NB comme pour n'importe quel langage de programmation, pour faciliter la 
// lisibilité de votre code, n'hésitez pas à le décomposer en plusieurs 
// fonctions

function lectureFichier(fichier) {
    var data = "";
    var tabLignes = fichier.split("\n");
    var i = 0;
    var premier = true;
    var singleton = false;
    while(i < tabLignes.length-1) {
        if(tabLignes[i] == "" || typeLigne(tabLignes[i]) == "//") {
            i++;
            continue;
            // la fonction switch() n'est pas reconnue par JavaScript for OPL.
        } else {

            if(typeLigne(tabLignes[i]) == "acte") {
                if(premier){
                    data = data + "actes = {\n";
                    premier = false;
                }
                data = data + lectureActe(normalisationLigne(tabLignes[i]));
            }

            if(typeLigne(tabLignes[i]) == "journee") {
                data = data + lectureJournee(normalisationLigne(tabLignes[i]));
                singleton = true;
            }

            if(typeLigne(tabLignes[i]) == "adresse") {
                if(premier){
                    data = data + "adresses = {\n";
                    premier = false;
                }
                data = data + lectureAdresse(normalisationLigne(tabLignes[i]));
            }

            if(typeLigne(tabLignes[i]) == "infirmiere") {
                if(premier){
                    data = data + "infirmieres = {\n";
                    premier = false;
                }
                data = data + lectureInfirmiere(normalisationLigne(tabLignes[i]));
            }

            if(typeLigne(tabLignes[i]) == "indisponibilite") {
                if(premier){
                    data = data + "indisponibilites = {\n";
                    premier = false;
                }
                data = data + lectureIndisponibilite(normalisationLigne(tabLignes[i]));
            }

            if(typeLigne(tabLignes[i]) == "soins") {
                if(premier){
                    data = data + "soins = {\n";
                    premier = false;
                }
                data = data + lectureSoin(normalisationLigne(tabLignes[i]));
            }
        }
        i++;
    }
    if(!singleton) {
        data = data + "};\n";
    }
    return data;
}

function normalisationLigne(ligne) {
    var data = new Array();
    var index = 0;

    var tabLignes = ligne.split(" ");
    
    var i = 0;
    while(i < tabLignes.length) {
        var tmp = tabLignes[i].split("	");
        var j = 0;
        
        while(j < tmp.length){
            if(tmp[j] == "") {
                j++;
                continue;
            } 
            data[index] = tmp[j];
            index++;

            j++;
        }

        i++;
    }

    return data;
}

function typeLigne(ligne) {
    var tabLigne = normalisationLigne(ligne);
    return tabLigne[0];
}

function lectureActe(tabActe, actes){
	var code = "";
	var duree = 0;
    var description = "";
    
    var i = 1;
    while(i < tabActe.length) {
        if(i == 1) {
            code = tabActe[i];
        }

        if (i == 2) {
            duree = parseInt(tabActe[i],10);
        }

        if (i == 3) {
            description = description + "\"" + tabActe[i] + " ";
        }

        if(i > 3 && i < tabActe.length-1) {
            description = description + tabActe[i] + " ";
        } 

        if (i == tabActe.length-1){
            description = description + tabActe[i] + "\"";
        } 
        i++;    
    }
    actes.add(code, duree, description);
}

function lectureSoinIni(tabSoin, soinsLecture){
    var nom = tabSoin[1];

    var i = 2;
    while(i < tabSoin.length) {
        
        var creneauCodes = tabSoin[i].split(":");

        var debut = "";
        var fin = "";

        if (creneauCodes[1] == "matin") {
            debut = "7h00";
            fin = "11h00";
        } 
        
        if (creneauCodes[1] == "midi") {
            debut = "11h00";
            fin = "15h00";
        } 
        
        if (creneauCodes[1] == "apres-midi") {
            debut = "15h00";
            fin = "19h00";
        }
        
        if (creneauCodes[1] == "soir") {
            debut = "19h00";
            fin = "21h00";
        }
        
        if(creneauCodes[1] != "matin" && creneauCodes[1] != "midi" && creneauCodes[1] != "apres-midi" && creneauCodes[1] != "soir") {
            var creneaux = decompositionCreneau(creneauCodes[1]);
            debut = (creneaux[0]);
            fin = (creneaux[1]);
        }

        var codes = creneauCodes[0].split("+");        
        var j = 0;
        while(j < codes.length) {
            soinsLecture.add(nom, horaireToMinutes(debut), horaireToMinutes(fin), codes[j])
            j++;
        }
        
        i++;    
    }
}

function decompositionCreneau(creneau) {
    var supprCrochetGauche = creneau.split("[");
    if(supprCrochetGauche[1] == null) {
        return;
    }
    var supprCrochetDroit = supprCrochetGauche[1].split("]");
    var separationDebutFin = supprCrochetDroit[0].split("-");
    return separationDebutFin;
}

function lectureSoin(tabSoin, soinsLecture){
    var nom = tabSoin[1];
    var i = 2;
    while(i < tabSoin.length) {
        var codesCreneau = tabSoin[i].split(":");
        var codes = codesCreneau[0];        
        soinsLecture.add(nom, codes);
        i++;    
    }
}

function soinsLectureToModele(soinsLecture, actes, adresses, soins) {
    soins.add(0, 0, "Démarrage cabinet", 0);
    var id = 1;
    for(var s in soinsLecture) {
        var duree = calculDuree(s.codes, actes);
        for(var a in adresses) {
            if(s.nom == a.nom) {
                soins.add(id, a.id, s.codes, duree);
                id++;
            }
        }
    }
    soins.add(id, 0, "Transmissions", calculDureeTransmission(adresses));
}

function calculDureeTransmission(adresses) {
    var nbPatients = Opl.card(adresses);
    var dureeTransmission = Math.ceil(nbPatients/3)*5;
    return dureeTransmission;
}

function calculDuree(codes, actes) {
    var duree = 0;
    var tabCodes = codes.split("+");
    var i = 0;
    while(i < tabCodes.length) {
        var code = tabCodes[i];
        for(a in actes) {
            if(a.code == code){
                duree = duree + a.duree;
            }
        }
        i++;
    }
    return duree;
}

function lectureJournee(tabJournee, journee){
    var i = 1;
    var infJ="";
    var supJ="";
    while(i < tabJournee.length) {
        if (i == tabJournee.length-1){
            supJ = normalisationHoraires(tabJournee[i]);
        } else {
            infJ = normalisationHoraires(tabJournee[i]);
        }
        i++;    
    }
    journee.infJ = horaireToMinutes(infJ);
    journee.supJ = horaireToMinutes(supJ);
}

function lectureInfirmiere(tabInfirmiere, infirmieres){
    nom = tabInfirmiere[1];
	var inf = "";
    var sup = "";
    
    if(tabInfirmiere.length == 2) {
        inf = "7h00";
        sup = "21h00";
    } else {
        inf = normalisationHoraires(tabInfirmiere[2]);
        sup = normalisationHoraires(tabInfirmiere[3]);
    }
    infirmieres.add(nom, horaireToMinutes(inf), horaireToMinutes(sup));
}

function lectureAdresse(tabAdresse, adressesLecture){
    var nom = tabAdresse[1];
    var adresse = "";
    var i = 2;
    while(i < tabAdresse.length) {
        if(i < tabAdresse.length-1) {
            adresse = adresse + tabAdresse[i] + " ";
        } 

        if (i == tabAdresse.length-1){
            adresse = adresse + tabAdresse[i];
        } 
        i++;    
    }
    adressesLecture.add(nom,adresse);
}

function lectureIndisponibilite(tabIndisponibilite, indisponibilites){

	var nom = tabIndisponibilite[1];
	var inf = normalisationHoraires(tabIndisponibilite[2]);
	var sup = normalisationHoraires(tabIndisponibilite[3]);

    indisponibilites.add(nom, horaireToMinutes(inf), horaireToMinutes(sup));
}

function secondsToMinutes(nbCoordonnees, durations, dureesInterEtapes){
    var i = 0;
    var j = 0;
    while (i < nbCoordonnees) {
        j = 0;
        while (j < nbCoordonnees) {
            var valeurMinute = Math.round(Math.round(durations[i][j]) / 60);
            dureesInterEtapes[i][j] = valeurMinute;
            j++;
        }
        i++;
    }
    return dureesInterEtapes;
}

function normalisationHoraires(heureMinute) {
    var separationHeureMinute = heureMinute.split("h");
    var heures = separationHeureMinute[0];
    if(separationHeureMinute[1] != null) {
        var minutes = "00";
    } else {
        var minutes = separationHeureMinute[1];
    }
    if(parseInt(heures) < 10) {
        heures = "0" + parseInt(heures);
    }
    if(parseInt(minutes) < 10) {
        minutes = "0" + parseInt(minutes);
    }
    return heures + "h" + minutes;
}

function horaireToMinutes(horaire) {
    var tabHoraire = horaire.split("h");
    if(tabHoraire[1] != "") {
        return parseInt(tabHoraire[0]) * 60 + parseInt(tabHoraire[1]);
    } else {
        return parseInt(tabHoraire[0]) * 60;
    }

}

function minutesToHoraire(minutes) {
    var heures = Math.trunc(minutes/60);
    var minutes = ((minute/60) - heures) * 60;
    return heures + "h" + minutes;
}

function adresseLectureToModele(adresseLecture, coordonneesGPS, adresse) {
    var i = 1;
    var cabinetCree = 0;
    for(var a in adresseLecture) {
        var tabAdresse = retraitementAdresseLecture(a.adresse);
        for(var c in coordonneesGPS) {
            if(tabAdresse["rue"] == c.place && tabAdresse["codePostal"] == c.postalCode) {
                if(a.nom == "cabinet" && cabinetCree == 0) {
                    adresse.add(0, a.nom, a.adresse, c.latitude, c.longitude);
                    cabinetCree = 1;
                    i--;
                } else {
                    adresse.add(i, a.nom, a.adresse, c.latitude, c.longitude);
                }
                i++;
            }
        }
    }
}

// TRAITEMENT DES ADRESSES POUR LES REQUETES AU SERVEUR OSRM
function decompositionAdresse(adresse, adressesRechercheCadastre, codesPostaux) {    
    var tabAdresse = adresse.split(",");
    var a = tabAdresse[0];
    tabCodeVille = normalisationLigne(tabAdresse[1]);
    var b = tabCodeVille[0];
	
    adressesRechercheCadastre.add(a);
    codesPostaux.add(b);
}

function retraitementAdresseLecture(adresseLecture) {   
    var data = new Array(); 
    var tabAdresse = adresseLecture.split(",");
    
    var rue = tabAdresse[0];
    tabCodeVille = normalisationLigne(tabAdresse[1]);
    var codePostal = tabCodeVille[0];
	
    data["rue"] = rue;
    data["codePostal"] = codePostal;

    return data;
}

function ecrireRequeteOSRM(coordonneesRequeteOSRM, coordonneesGPS) {
    var i = 1;
    for(var c in coordonneesGPS) {
        if (i == Opl.card(coordonneesGPS)) {
            coordonneesRequeteOSRM = coordonneesRequeteOSRM + c.longitude + "," + c.latitude;
        } else {
            coordonneesRequeteOSRM = coordonneesRequeteOSRM + c.longitude + "," + c.latitude + ";";
        }
        i++;
    }

    return coordonneesRequeteOSRM;
}



