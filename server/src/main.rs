use anyhow::Result;
use axum::routing::get;
use tracing::{Level, event};

mod redirects;
mod server;
mod web;

#[tokio::main]
async fn main() -> Result<()> {
    server::setup_logs()?;
    event!(Level::INFO, "Launching loshido.me server");

    let app = web::routes()?
        .route("/github", get(redirects::github))
        .route("/linkedin", get(redirects::linkedin));

    server::serve(app).await
}
