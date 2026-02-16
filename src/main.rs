use axum::{Router, extract::Request, middleware::{self, Next}, response::Response};
use tower_http::services::ServeDir;

mod net;

async fn cache_control(mut req: Request, next: Next) -> Response {
    let headers = req.headers_mut();

    headers.insert("cache-control", "public, max-age=2592000, immutable".parse().unwrap());

    next.run(req).await
}

#[tokio::main]
async fn main() {
    let dist = ServeDir::new("./dist");

    let app = Router::new()
        .fallback_service(dist)
        .layer(middleware::from_fn(cache_control));

    net::serve(app).await;
}