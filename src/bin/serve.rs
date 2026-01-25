use axum::{Router, routing::get_service};
use loshido::{files_router, net::serve};
use tower_http::services::{ServeDir, ServeFile};

#[tokio::main]
async fn main() {
    let dist = ServeDir::new("./dist");
    let routes = files_router! {
        "/" => "./dist/index.html",
        "/projets/explorer" => "./dist/projets/explorer.html",
    };

    let app = Router::new()
        .merge(routes)
        .fallback_service(dist);

    serve(app).await;
}