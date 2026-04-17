FROM oven/bun:latest AS web
COPY vite /vite
WORKDIR /vite

RUN bun i
RUN bun run build
FROM oven/bun:latest AS ogp-banner
COPY vite /vite
COPY ogp /ogp
WORKDIR /ogp

RUN bun i
RUN bun run build

FROM clux/muslrust:stable AS chef
USER root
RUN cargo install --locked cargo-chef
WORKDIR /app

FROM chef AS planner
COPY src src
COPY Cargo.* .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --target x86_64-unknown-linux-musl --recipe-path recipe.json
COPY src src
COPY Cargo.* .
RUN cargo build --release --target x86_64-unknown-linux-musl

FROM alpine:latest AS runtime
WORKDIR /app

COPY --from=web /dist /app/dist
COPY --from=ogp-banner /ogp/dist/ogp-banner.webp /app/dist/
COPY --from=builder /app/target/x86_64-unknown-linux-musl/release/loshido /usr/local/bin/
RUN mv /app/dist/routes/* /app/dist && rmdir /app/dist/routes

EXPOSE 80
CMD ["/usr/local/bin/loshido"]