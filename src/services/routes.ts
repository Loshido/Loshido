type Handle = (req: Request, url: URLPatternResult, info: Deno.ServeHandlerInfo) => 
    Response | Promise<Response | 'next'> | 'next'
type Mode = 'ssg' | 'ssr'
type Routes = Map<URLPattern, Handle>

declare global {
    interface Route<T = unknown> {
        path: string,

        // use ssg or ssr
        handle: (mode: 'ssr' | 'ssg') => Handle,

        // template name
        name?: string 
        // generate page (SSG)
        generate?: (args?: T) => Promise<string | null>,
    }
}

const mode: Mode = ['ssg', 'ssr'].includes(Deno.env.get('MODE') || '') 
    ? Deno.env.get('MODE') as Mode
    : 'ssr' 
    
const isRouteValid = (obj: unknown) => typeof obj === 'object' && obj !== null &&
    ('path' in obj) && typeof obj.path === 'string' &&
    ('handle' in obj) && typeof obj.handle === 'function'

// explore routes & return them
async function exploreRoutes(directory?: string): Promise<Route[]> {
    const dir = directory ?? './src/routes'
    const mods = []
    for await(const entry of Deno.readDir(dir)) {
        const next = dir + '/' + entry.name
    
        if(entry.isDirectory) mods.push(...await exploreRoutes(next))
        else if(entry.isFile && entry.name.endsWith('.ts')) {
            const mod = await import('../../' + next)

            for(const obj of Object.values(mod)) {
                if(isRouteValid(obj)) 
                    mods.push(obj as Route)
            }
        }
    }
    return mods
}

// explore routes & create a routing map
export default async () => {
    const routes: Routes = new Map();
    const mods = await exploreRoutes()
    for(const mod of mods) {
        const pattern = new URLPattern({ pathname: mod.path })
        routes.set(pattern, mod.handle(mode))
    }

    return routes
}