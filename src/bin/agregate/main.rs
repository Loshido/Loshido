use std::{fs::{create_dir, exists, read_to_string, write}, io::Error, path::Path};
use crate::{files::copy_dir_all, fragments::agregate};

mod files;
mod fragments;

const INPUTS: [&str; 1] = [
    "index.html"
];
pub const BASE: &str = "./web";
pub const FRAGMENTS: &str = "./web/fragments";
pub const OUT: &str = "./dist";


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
        write(file_path, file)?;

        println!("{} complété", input);
    }

    copy_dir_all(base_path.join("assets"), out_path.join("assets"))?;

    Ok(())
}