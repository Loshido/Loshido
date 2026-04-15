import type { Font } from "takumi-js";
import { readFile } from "fs/promises"

const path = '/assets/fonts/Satoshi.ttf'
const satoshi = await readFile('../vite/public' + path)

export default [
    {
        name: "Satoshi",
        data: satoshi.buffer
    }
] as Font[]