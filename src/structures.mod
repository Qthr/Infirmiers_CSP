/************************
* Devoir IALC 2018-19 - M1 Miage App 
* Binome : POISSON Caroline, THERRE Quentin
*
* Description : Structures principales du modèle
************************/

// ------------------------ Structures  ------------------------------------
execute {
	writeln("DEGUG : readding structure.mod... ");
}
// -----------------------  Instances Descriptions --------------------------
tuple Instance {
    string name;			// name of the instance
    {string} files;			// text files with raw data describing the instance 
}

// -------------- geo-localization from the cadastre registry -------------------
tuple CadastreAddress {
	float	longitude;
	float	latitude;
	string	place;
	int 	postalCode;
	string	city;
	string	country;
}

execute {
	writeln("DEGUG : done ");
}
