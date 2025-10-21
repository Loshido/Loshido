// lissajous.svg
import svgFromHostname from "../services/lissajous.ts"

export default {
    path: '/lissajous.svg',
    handle() {
        return (_req, _url, info) => {
            const addr = 'hostname' in info.remoteAddr ? info.remoteAddr.hostname : null
            if(!addr) return 'next'
            const svg = svgFromHostname(addr)

            return new Response(svg, { 
                headers: {
                    'content-type': 'image/svg+xml',
                    'cache-control': 'max-age=31536000, immutable'
                },
                status: 200 
            })
        }
    },
    name: 'lissajous.svg'
} satisfies Route<undefined>