/************************
* Devoir IALC 2018-19 - M1 Miage App 
* Binome : POISSON Caroline, THERRE Quentin
*
* Modèle : visites2.mod
* Description : Minimisation du temps total de travail d'une infirmière
*
************************/
using CP;

include "structures.mod";

string modelName = "visite1";

Instance instance = ...;		/* instance de problème à résoudre */
{CadastreAddress} addressBase = ...;

/************************************************************************
* Lecture du fichier d'instance
************************************************************************/

include "structuresLecture.mod";

{Acte} actes;
{SoinLecture} soinsLecture;
Journee journee;
{Infirmiere} infirmieres;
{Indisponibilite} indisponibilites;

{AdresseLecture} adressesLecture;
{string} adressesRechercheCadastre;
{int} codesPostaux;
{CoordonneesGPS} coordonneesGPS = union (<longitude, latitude, place, postalCode, city, country> in addressBase : place in adressesRechercheCadastre && postalCode in codesPostaux) {<place, postalCode, longitude, latitude>};
string coordonneesRequeteOSRM;
range rCoordonneesGPS = 0..card(coordonneesGPS)-1;

int dureesInterEtapes[rCoordonneesGPS][rCoordonneesGPS];

{Adresse} adresses;
{Soin} soins;

execute {
    includeScript("../libs/files.js");
    includeScript("../libs/geoServices.js");
    includeScript("../libs/simpleJSONParser.js");
    includeScript("js/lectureInstance.js");	// Permet d'inclure un fichier de script

// Lecture des données de l'instance
    for(var f in instance.files) {
        var fichier = file_to_string(f);
        //------------------------------------------------------------
        var tabLignes = fichier.split("\n");
        var i = 0;
        while (i < tabLignes.length-1) {
            if (tabLignes[i] == "" || typeLigne(tabLignes[i]) == "//") {
                i++;
                continue;
                // la fonction switch() n'est pas reconnue par JavaScript for OPL.
            } else {
                if(typeLigne(tabLignes[i]) == "journee") {
                    lectureJournee(normalisationLigne(tabLignes[i]), journee);
                }
                if(typeLigne(tabLignes[i]) == "acte") {
                    lectureActe(normalisationLigne(tabLignes[i]), actes);
                }
                if(typeLigne(tabLignes[i]) == "soins") {
                    lectureSoin(normalisationLigne(tabLignes[i]), soinsLecture);
                }  
                
                if(typeLigne(tabLignes[i]) == "infirmiere") {
                    lectureInfirmiere(normalisationLigne(tabLignes[i]), infirmieres, journee.infJ, journee.supJ);   
                }
                if(typeLigne(tabLignes[i]) == "indisponibilite") {
                    lectureIndisponibilite(normalisationLigne(tabLignes[i]), indisponibilites);
                }
                if(typeLigne(tabLignes[i]) == "adresse") {
                    lectureAdresse(normalisationLigne(tabLignes[i]), adressesLecture);
                }
            }
            i++;
        }
    }

// Préparation des adresses pour la recherche dans les données du cadastre 
    for(var a in adressesLecture){
        decompositionAdresse(a.adresse, adressesRechercheCadastre, codesPostaux);
        writeln("adresses recherche cadastre : " + adressesLecture);
        writeln("codes postaux : " + codesPostaux);
    }
    writeln(coordonneesGPS);
    coordonneesRequeteOSRM = ecrireRequeteOSRM(coordonneesRequeteOSRM, coordonneesGPS);
    var answer = osrm_table(coordonneesRequeteOSRM, "osrm.dep-informatique.u-psud.fr:5000");
    var durations = answer.durations;
    dureesInterEtapes = secondsToMinutes(Opl.card(coordonneesGPS), durations, dureesInterEtapes);

    adresseLectureToModele(adressesLecture, coordonneesGPS, adresses);
    soinsLectureToModele(soinsLecture, actes, adresses, soins);

    writeln("adresses : " + adresses);
    writeln("soins lectures : " + soinsLecture);
    writeln("soins : " + soins);
    writeln(dureesInterEtapes);

}

/************************************************************************
* Pré-traitement
************************************************************************/

int nbAdresses = card(adresses);                // Le nombre d'adresses à visiter
int nbSoins = card(soins);                       // Le nombre de soins à administrer
range rAdresse = 0..nbAdresses-1;
range rSoin = 0..nbSoins-1;
int durations[rAdresse][rAdresse] = dureesInterEtapes;


// Adresses
// Accès par nom
{string} nomsAdresses = {a.nom | a in adresses} ;
Adresse adresseParNom[nomsAdresses] = [a.nom : a | a in adresses];
// Accès par id
{int} idsAdresses = {a.id | a in adresses} ;
Adresse adresseParId[idsAdresses] = [a.id : a | a in adresses];

// Soins
// Accès par id
{int} idsSoins = {s.id | s in soins} ;
Soin soinParId[idsSoins] = [s.id : s | s in soins];
// Tableau qui fait correspondre id soins / id adresse
int idAdresseParIdSoin[idsSoins] = [s.id : s.idAdresse | s in soins];


// On considère que le nombre d'étapes total est le nombre de soins à administrer + les passages au cabinet 
// (un patient pouvant se voir adminstrer plusieurs soins dans une journée)
int nbEtapes = nbSoins;
range rEtapes = 0..nbEtapes-1;

// Durée de la transition maximale
int dureeMaxTransition = max(i,j in rAdresse) durations[i][j];


/************************************************************************
* Variables de décision
************************************************************************/

dvar int Position[rEtapes] in rAdresse;                         // Position[2] = 3 signifie la position de l'étape 2 est l'adresse d'id 3 
dvar int Transition[rEtapes] in 0..dureeMaxTransition;          // Transition[2] = 134 signifie la durée de transition pour passer de l'étape 2 à l'étape 3 est 134 minutes 
dvar int Action[rEtapes] in rSoin;                              // Action[2] = 5 signifique l'action réalisée à l'étape 2 est l'admibistration des soins d'id 5
        
dvar int dateDebut[rEtapes] in 0..1439;                         // dateDebut[2] = 123 signifie que la date de début de l'étape 2 en minutes est : 123
dvar int dateFin[rEtapes] in 0..1439;                           // dateDebut[5] = 567 signifie que la date de fin de l'étape 3 en minutes est : 567
                                          
dexpr int nbAdressesVisitees = sum (i in idsAdresses) (0 < count(Position, i));   // Compte le nombre d'adresses différentes visitées -> Pour contraindre à passer par toutes les adresses 
dexpr int dureeTransitions = sum(i in rEtapes) Transition[i];

minimize dureeTransitions;

/************************************************************************
* Contraintes du modèle 					(NB : ne peut être mutualisé)
************************************************************************/

subject to{
    nbAdressesVisitees == nbAdresses;                       // Contraint à passer par toutes les adresses au moins une fois
    Position[0] == adresseParNom["cabinet"].id;             // L'étape 0 doit avoir l'adresse cabinet
    Position[nbEtapes-1] == adresseParNom["cabinet"].id;    // La dernière étape doit avoir l'adresse cabinet

    forall(i in 0..nbEtapes-2){
        Transition[i] == durations[Position[i]][Position[i+1]];             // Durée de transition entre l'étape i et i+1
                                                                            // Il faut s'arranger pour que les indices de dureesInterArdresses correspondent à l'id des adresses.
    }
    Transition[nbEtapes-1] == 0;    // La durée de transition de la dernière étape est 0.

	dateDebut[0] == journee.infJ;
    dateFin[0] == dateDebut[0] + soinParId[Action[0]].duree;
    forall(i in 1..nbEtapes-1){
		dateDebut[i] == dateFin[i-1] + Transition[i-1];
        dateFin[i] == dateDebut[i] + soinParId[Action[i]].duree;
    }
	
    // Contrainte qui buguait
    forall(i in rEtapes){
        idAdresseParIdSoin[Action[i]] == Position[i];               // Fait correspondre une action de soins à une étape ayant la même adresse que le déroulement du soin
    }
    allDifferent(Action);                                           // A chaque étape correspond une action différente.
    
   


}


include "postProcessing2.mod";


