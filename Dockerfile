FROM rust:alpine AS builder
WORKDIR /app

COPY src src
COPY web web
COPY Cargo.* .
RUN cargo run --bin agregate
RUN cargo build -r --bin serve

FROM alpine:latest
WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/target/release/serve /app/serve

EXPOSE 80
ENTRYPOINT [ "/app/serve" ]