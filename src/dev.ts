import { serveDir } from "@std/http/file-server"
import tailwind from "./tailwind.ts"
import mapRoutes from "./routes.ts"

tailwind({ watch: true, quiet: true })
const routes = await mapRoutes()

routes.set(new URLPattern({ pathname: '/assets/*'}), (req) => serveDir(req, {
    fsRoot: './assets',
    urlRoot: 'assets'
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
