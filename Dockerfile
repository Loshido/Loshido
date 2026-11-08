FROM oven/bun:latest AS web
WORKDIR /web

COPY ./web/package.json ./web/bun.lock ./

RUN bun i

COPY ./web/ ./

RUN bun run build

# RUST CHEF
FROM clux/muslrust:stable AS chef
RUN cargo install --locked cargo-chef
WORKDIR /app

# RUST PLANNER
FROM chef AS planner
COPY ./server .
RUN cargo chef prepare --recipe-path recipe.json

# RUST BUILDER
FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --target x86_64-unknown-linux-musl --recipe-path recipe.json
COPY ./server .
RUN cargo build --release --target x86_64-unknown-linux-musl

FROM alpine AS runtime
WORKDIR /loshido-me
COPY --from=web /web/dist ./dist
COPY --from=builder /app/target/x86_64-unknown-linux-musl/release/server /usr/local/bin/loshido-me

EXPOSE 5173
CMD ["/usr/local/bin/loshido.me"]

LABEL org.opencontainers.image.source https://github.com/Loshido/loshido
