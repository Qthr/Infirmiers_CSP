tuple Etape {
	string infirmiere;	// la chaine correspondant au nom de l'infirmière
	int	etape;			// numéro d'étape pour le planning de l'infirmière (0 pour la premier passage au cabinet)			// nb s'il y a plusieurs infirmières qui travaillent, chacune d'entre elle a une étape 0.
	string visite;		// Nom du Patient visité ou "cabinet" (pour première et la dernière étape d'un planning )
	string adresse; 	// Adresse (au format string) du patient ou du cabinet (telle que dans l'instance)
	float latitude; 	// Latitude de l'adresse 
	float longitude;	// Longitude de l'adresse 
	string description;	// codes de soins ou "Depart Bureau" ou "Transmissions"
	int debut;      	// horaire (en mn) du début de l'étape (entier compris entre 0 et 1439)
	int duree;      	// (durée de la visite en mn) ou  0 (pour la premire étape) ou durée des transmissions (en mn)
	int fin;      		// horaire de la fin de l'étape (en mn) du début des soins (entier compris entre 0 et 1439)
	int transit; 		// temps de transit vers l'étape suivante (O si c'est la dernière étape)
}