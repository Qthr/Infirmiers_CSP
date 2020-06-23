// Author Ph. Chatalic

// ------------------ Function on files -----------------

// Reads the content of a file and returns its content as a string
function file_to_string(file) {
	var f = new IloOplInputFile(file);
    if (f.exists) {
 //     writeln("Reading file : ", fichier );
      var s = "";
      while (!f.eof) {
        s = s  + f.readline() +"\n";
      }
      f.close();	// Fermeture fichier instance
    }
    else
      writeln("\nWARNING : the file ", file," doesn't exist");
	return s;
}


