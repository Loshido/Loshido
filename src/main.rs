use axum::Router;
use tower_http::services::ServeDir;

mod macros;
mod net;

#[tokio::main]
async fn main() {
    let dist = ServeDir::new("./dist");

    let app = Router::new()
        .fallback_service(dist);

    net::serve(app).await;
}