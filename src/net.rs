use axum::Router;
use opentelemetry_sdk::trace::SdkTracerProvider;
#[cfg(unix)]
use tokio::signal;

async fn shutdown_signal(provider: Option<SdkTracerProvider>) {
    let ctrl_c = async {
        tokio::signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }
    if let Some(provider) = provider {
        let _ = provider.shutdown();
    }
}

pub async fn serve(router: Router, provider: Option<SdkTracerProvider>) {
    let listener = tokio::net::TcpListener::bind("0.0.0.0:80").await.unwrap();

    tracing::info!("Listening on http://localhost:80");

    axum::serve(listener, router)
        .with_graceful_shutdown(shutdown_signal(provider))
        .await
        .unwrap();

    println!("Stopped listening");
}
