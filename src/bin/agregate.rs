use std::{fs::{create_dir, create_dir_all, exists, read_to_string, write}, io::Error, path::Path};
use loshido::agregate::{fragments::agregate, OUT, BASE, files::copy_dir_all};

const INPUTS: [&str; 2] = [
    "index.html", 
    "projets/explorer.html"
];

fn main() -> Result<(), Error> {
    // Création du dossier de sortie
    match exists(OUT)? {
        true => (),
        false => create_dir(OUT)?
    }
    let base_path = Path::new(BASE);
    let out_path = Path::new(OUT);
    
    for input in INPUTS {
        let file_path = base_path.join(input);
        let mut file = read_to_string(file_path)?;
        
        agregate(&mut file);

        let file_path = out_path.join(input);
        if let Some(parent) = file_path.parent() {
            // On créé les dossiers parents
            create_dir_all(parent)?;
        }

        write(file_path, file)?;

        println!("{} complété", input);
    }

    copy_dir_all(base_path.join("assets"), out_path.join("assets"))?;

    Ok(())
}