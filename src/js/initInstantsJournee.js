/************************
* Devoir IALC 2018-19 - M1 Miage App 
* Binome : POISSON Caroline, THERRE Quentin
*
* Fonctions de script utiles pour la lecture des fichiers d'instance
************************/

// NB comme pour n'importe quel langage de programmation, pour faciliter la 
// lisibilité de votre code, n'hésitez pas à le décomposer en plusieurs 
// fonctions

function initInstantsJournee(heures, minutes, instantsJournee) {
    var i = 0;
    for (var j in heures) {
        for(var k in minutes) {
            var bkJ = j;
            var bkK = k;
            if(j < 10){
                var j = "0" + j;
            }
            if(k < 10){
                var k = "0" + k;
            }
            var heureMinute = j + "h" + k;
            instantsJournee.add(heureMinute, i);
            i++;
            j = bkJ;
            k = bkK;
        }
    } 
}
