// render routes via mizu
import { serveDir } from "@std/http/file-server"
import tailwind from "./tailwind.ts"
import mapRoutes from "./main.ts"

tailwind({ watch: true, quiet: true })
const routes = await mapRoutes()
Deno.serve({ port: 80 }, async (req, info) => {
    for(const key of routes.keys()) {
        const match = key.exec(req.url)
        if(match) {
            const resp = await routes.get(key)!(req, match, info)
            if(resp !== 'next') return resp
        }
    }
    
    const url = new URL(req.url)
    if(url.pathname.startsWith('/assets')) {
        return serveDir(req, {
            fsRoot: './assets',
            urlRoot: 'assets'
        })
    }

    return serveDir(req, {
        fsRoot: './templates'
    })
})
