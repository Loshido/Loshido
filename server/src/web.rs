use std::{path::PathBuf, str::FromStr};

use anyhow::Result;
use axum::{Router, routing::get_service};
use tower_http::services::{ServeDir, ServeFile};

const DIST_PATH_DEFAULT: &str = "../web/dist";
pub fn routes() -> Result<Router> {
    let parent = {
        let parent = std::env::var("DIST_PATH").unwrap_or(DIST_PATH_DEFAULT.to_string());

        PathBuf::from_str(&parent)?
    };
    let index_path = parent.join("index.html");
    let assets_path = parent.join("assets");

    let index = ServeFile::new(index_path);
    let assets = ServeDir::new(assets_path);

    let router = Router::new()
        .route("/", get_service(index))
        .nest_service("/assets", assets);

    Ok(router)
}
