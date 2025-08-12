FROM denoland/deno:alpine

WORKDIR /app

COPY deno.json deno.lock ./

RUN apk add --no-cache libstdc++ vips git
RUN deno install --allow-scripts=npm:sharp npm:sharp && deno install --allow-scripts
COPY . .
RUN deno -A astro telemetry disable && deno task build

EXPOSE 80
CMD [ "task", "preview" ]