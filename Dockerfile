FROM rust:alpine AS builder
WORKDIR /app

COPY src src
COPY Cargo.* .
RUN cargo build -r

FROM oven/bun:latest AS web
COPY web /web
WORKDIR /web

RUN bun i
RUN bun run build

FROM alpine:latest
WORKDIR /app

COPY --from=builder /app/target/release/loshido /app/serve
COPY --from=web /dist /app/dist

EXPOSE 80
ENTRYPOINT [ "/app/serve" ]