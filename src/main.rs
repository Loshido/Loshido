use axum::{
    Router,
    extract::Request,
    middleware::{self, Next},
    response::Response,
};
#[cfg(feature = "otel")]
use tower_http::services::ServeDir;
#[cfg(feature = "otel")]
use tower_http::trace::TraceLayer;

mod net;
#[cfg(feature = "otel")]
mod tracing;

async fn cache_control(mut req: Request, next: Next) -> Response {
    let headers = req.headers_mut();

    headers.insert(
        "cache-control",
        "public, max-age=2592000, immutable".parse().unwrap(),
    );

    next.run(req).await
}

#[tokio::main]
async fn main() {
    #[cfg(feature = "otel")]
    let provider = tracing::init_tracing();

    let dist = ServeDir::new("./dist");

    let app = Router::new()
        .fallback_service(dist)
        .layer(middleware::from_fn(cache_control));

    #[cfg(feature = "otel")]
    let app = app.layer(TraceLayer::new_for_http());

    #[cfg(feature = "otel")]
    net::serve(app, Some(provider)).await;

    #[cfg(not(feature = "otel"))]
    net::serve(app, None).await;
}
