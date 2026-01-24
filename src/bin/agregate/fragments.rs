use std::{fs::read_to_string, path::Path};

use crate::FRAGMENTS;

fn find_fragment(path: &str) -> String {
    let fragment_path = Path::new(FRAGMENTS).join(path);

    match read_to_string(fragment_path) {
        Ok(f) => f,
        Err(_) => panic!("Le fragment {} n'existe pas", path)
    }
}

fn collect_fragments(input: String) -> Vec<(String, usize, usize)> {
    let mut fragments = Vec::new();
    for (idx, _) in input.match_indices("r{") {
        let sub = input.get(idx..).unwrap();
        let (length, _) = match sub.match_indices("}").next() {
            Some(idx) => idx,
            None => panic!("Un chemin de fragment est imcomplet!")
        };

        // on retire `r{` et `}`
        let fragment_str = match sub.get(2..=length - 1) {
            Some(path) => path,
            None => continue
        };
        let mut fragment = find_fragment(fragment_str);

        // recursivité
        agregate(&mut fragment);

        fragments.push((fragment, idx, length));
    }

    fragments
}

pub fn agregate(input: &mut String) {
    let mut deplacement = 0i32;
    let fragments = collect_fragments(input.clone());

    for (fragment, idx, length) in fragments {
        let from = (deplacement + idx as i32) as usize;
        let to = (deplacement + (idx + length) as i32) as usize;

        input.replace_range(from..=to, &fragment);
        deplacement += fragment.len() as i32 - length as i32 - 1;
    }
}