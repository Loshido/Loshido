use anyhow::Result;
use axum::Router;
use tokio::net::TcpListener;
use tracing::{Level, event, subscriber};

/// écoute sur le port 80 et sert le router donné.
pub async fn serve(app: Router) -> Result<()> {
    let listener = TcpListener::bind("0.0.0.0:80").await?;

    event!(Level::INFO, "Listening on localhost:80");

    let result = axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await;

    event!(Level::INFO, "Shutting down");

    Ok(result?)
}

async fn shutdown_signal() {
    let ctrl_c = async {
        let _ = tokio::signal::ctrl_c().await;
    };

    #[cfg(unix)]
    let terminate = async {
        if let Ok(mut s) = tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
        {
            s.recv().await;
        }
    };
    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }
}

pub fn setup_logs() -> Result<()> {
    let logs = tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .with_ansi(true)
        .compact()
        .finish();
    subscriber::set_global_default(logs)?;

    Ok(())
}
