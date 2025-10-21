import { serveDir } from "@std/http/file-server"

Deno.env.set('MODE', 'ssg')
import mapRoutes from "./services/routes.ts"
const routes = await mapRoutes()

routes.set(new URLPattern({ pathname: '/assets/*'}), (req) => serveDir(req, {
    fsRoot: './assets',
    urlRoot: 'assets',
    headers: [
        "cache-control: public, max-age=172800, stale-while-revalidate=86400"
    ]
}))

Deno.serve({ port: 80 }, async (req, info) => {
    for(const key of routes.keys()) {
        const match = key.exec(req.url)
        if(!match) continue
        
        const resp = await routes.get(key)!(req, match, info)
        if(resp !== 'next') return resp
    }
    
    return new Response('Not Found dev.ts')
})
