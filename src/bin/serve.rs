use axum::Router;
use tower_http::services::ServeDir;

#[tokio::main]
async fn main() {
    let web = ServeDir::new("./dist");
    let app = Router::new()
        .fallback_service(web);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:80").await.unwrap();
    println!("Listening on http://localhost:80");
    axum::serve(listener, app).await.unwrap();
}