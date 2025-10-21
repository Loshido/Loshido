FROM denoland/deno:alpine AS build
WORKDIR /app

COPY . .
RUN apk add git && echo "GIT_HEAD=$(git rev-parse --short HEAD)" > commit && source /app/commit
RUN GIT_HEAD="$(git rev-parse HEAD)" deno task build

FROM denoland/deno:alpine
WORKDIR /app

COPY . .
COPY --from=build /app/dist /app/dist
COPY --from=build /app/assets /app/assets

ENV MODE=ssg
RUN rm -rf .git && deno cache src/start.ts

EXPOSE 80
ENTRYPOINT [ "deno", "task" ]
CMD [ "start" ]