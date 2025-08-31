import type { APIRoute } from "astro";
import svgFromHostname from "../services/lissajous.ts"

export const GET: APIRoute = ({ clientAddress }) => {
    const svg = svgFromHostname(clientAddress)

    return new Response(svg, { 
        headers: {
            'content-type': 'image/svg+xml',
            'cache-control': 'max-age=31536000, immutable'
        },
        status: 200 
    })
}