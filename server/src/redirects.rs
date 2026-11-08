// https://loshido.me/github
// https://loshido.me/linkedin
// Aucune donnée relative à l'identité du client n'est
// stockée en suivant ces redirections.

use std::{
    fs::OpenOptions,
    io::Write,
    time::{SystemTime, UNIX_EPOCH},
};

use axum::response::Redirect;
use tracing::{Level, event};

const REDIRECTS_LOG: &str = "redirects.csv";

pub async fn github() -> Redirect {
    log_redirection("github");

    Redirect::to("https://github.com/Loshido")
}
pub async fn linkedin() -> Redirect {
    log_redirection("linkedin");

    Redirect::to("https://linkedin.com/in/livio-ardoin")
}

fn log_redirection(name: &str) {
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();

    let result = OpenOptions::new()
        .create(true)
        .append(true)
        .open(REDIRECTS_LOG)
        .and_then(|mut file| {
            if file.metadata()?.len() == 0 {
                writeln!(file, "timestamp,redirection")?;
            }
            writeln!(file, "{timestamp},{name}")
        });

    if let Err(err) = result {
        event!(
            Level::ERROR,
            "écriture de {REDIRECTS_LOG} impossible : {err}"
        );
    }
}
