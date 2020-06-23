/************************
* Devoir IALC 2018-19 - M1 Miage App 
* Binome : Nom1 Nom 2 	(TODO)
*
* Modèle : visites2.mod
* Description : TODO
*
************************/
using CP;

string modelName = "visite3";

include "structures.mod"

Instance instance = ...;		/* instance de problème à résoudre */

/************************************************************************
* Lecture du fichier d'instance
************************************************************************/

include "structuresLecture.mod";

execute {  
	includeScript("lectureInstance.js");	// Permet d'inclure un fichier de script
	
	// TODO - appeler la fonction que vous aurez définie et 
	// permettant de lire le contenu des fichiers décrivant l'instance, 
	// pour alimenter les structures de données que vous jugez utiles  		
}

/************************************************************************
* Prétraitement sur les données de l'instance 
************************************************************************/

/* TODO 
Déclaration des structures de données utiles pour faciliter
l'expression du modèle
*/


/************************************************************************
* Variables de décision
************************************************************************/

/* TODO */

/************************************************************************
* Contraintes du modèle 					(NB : ne peut être mutualisé)
************************************************************************/

/* TODO */


/************************************************************************
* Contrôle de flux  (si besoin)
************************************************************************/

/* TODO */

/************************************************************************
* PostTraitement
************************************************************************/

/* TODO */
/* TODO Console output*/

int optimum; 		// TODO  initialize to the optimization criteria

include "postProcessing.mod";

include "postProcessingMap.mod";

