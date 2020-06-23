/************************
* Devoir IALC 2018-19 - M1 Miage App 
* Binome : POISSON Caroline, THERRE Quentin
*
* Description : Structures utiles pour la lecture des données d'instances
************************/

// -------------- Structures pour le modèle -------------------
tuple Journee {
	int infJ;
	int supJ;
}

tuple Infirmiere {
	string nom;
	int inf;
	int sup;
}

tuple Indisponibilite {
	string nom;
	int inf;
	int sup;
}

tuple Acte {
	string code;
	int duree;
	string description;
}

tuple SoinLecture {
	string nom;
	string codes;
}

tuple AdresseLecture {
	string nom;
	string adresse;
}

tuple CoordonneesGPS {
	string	place;
	int 	postalCode;
	float longitude;
	float latitude;
}

tuple Adresse {
	int id;						// identifiant unique de 0 à nombre d'adresses
	string nom;
	string adresse;
	float latitude;
	float longitude;
}

tuple Soin {
	int id;						// identifiant unique de 0 à nombre de soins
	int idAdresse;				// Récupéré l'id de l'adresse correspondant au soin grâce à adresseParId
	string codes;				// Codes des soins
	int duree;
}

