type Handle = (req: Request, url: URLPatternResult, info: Deno.ServeHandlerInfo) => 
    Response | Promise<Response | 'next'> | 'next'

declare global {
    interface Route {
        path: string,

        // use ssg or ssr
        handle: (mode: 'ssr' | 'ssg') => Handle,

        // template name
        name?: string 
        // generate page (SSG)
        generate?: () => Promise<string | null>,
    }
}

const mode: 'ssg' | 'ssr' = ['ssg', 'ssr'].includes(Deno.env.get('MODE') || '') 
    ? Deno.env.get('MODE') as 'ssr' | 'ssg'
    : 'ssr' 

// explore routes & return them
export async function explore(directory?: string): Promise<Route[]> {
    const dir = directory ?? './src/routes'
    const mods = []
    for await(const entry of Deno.readDir(dir)) {
        const next = dir + '/' + entry.name
    
        if(entry.isDirectory) {
            mods.push(...await explore(next))
        } else if(entry.isFile && entry.name.endsWith('.ts')) {
            const mod = await import('../' + next)

            for(const obj of Object.values(mod)) {
                if(
                    typeof obj !== 'object' || obj === null ||
                    !('path' in obj) || typeof obj.path !== 'string' ||
                    !('handle' in obj) || typeof obj.handle !== 'function'
                ) continue

                mods.push(obj as Route)
            }
        }
    }
    return mods
}

// explore routes & create a routing map
export default async function routes() {
    const routes: Map<URLPattern, Handle> = new Map();
    const mods = await explore()
    for(const mod of mods) {
        const pattern = new URLPattern({ pathname: mod.path })
        routes.set(pattern, mod.handle(mode))
    }

    return routes
}