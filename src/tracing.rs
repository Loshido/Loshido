use opentelemetry::trace::TracerProvider;
use opentelemetry_otlp::WithExportConfig;
use opentelemetry_sdk::{propagation::TraceContextPropagator, trace::SdkTracerProvider};
use tracing_subscriber::{EnvFilter, Layer, layer::SubscriberExt, util::SubscriberInitExt};

pub fn init_tracing() -> SdkTracerProvider {
    opentelemetry::global::set_text_map_propagator(TraceContextPropagator::new());

    let endpoint = match std::env::var("OTEL_ENDPOINT") {
        Ok(endpoint) => endpoint,
        Err(e) => panic!("OTEL_ENDPOINT not set\n {}", e),
    };

    let exporter = opentelemetry_otlp::SpanExporter::builder()
        .with_tonic()
        .with_endpoint(&endpoint)
        .build()
        .expect("failed to build OTLP exporter");

    let provider = SdkTracerProvider::builder()
        .with_batch_exporter(exporter)
        .with_resource(
            opentelemetry_sdk::Resource::builder_empty()
                .with_attribute(opentelemetry::KeyValue::new(
                    "service.name",
                    "loshido.me-axum",
                ))
                .build(),
        )
        .build();

    let tracer = provider.tracer("axum-service");

    tracing_subscriber::registry()
        .with(
            tracing_opentelemetry::layer()
                .with_tracer(tracer)
                .with_filter(EnvFilter::from_default_env()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    provider
}
