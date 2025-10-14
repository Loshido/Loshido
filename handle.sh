#!/bin/sh

status=1

while [ $status -ne 0 ]; do
    deno run \
        --env-file=.env \
        --allow-net \
        --allow-read \
        --allow-ffi \
        --allow-env \
        --allow-run \
        ./dist/server/entry.mjs

    code=$?

    if [ $code -ne 2 ]; then
        status=0
        break
    fi
done