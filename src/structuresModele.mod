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

