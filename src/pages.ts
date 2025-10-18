import { exists } from "@std/fs/exists";

export const TEMPLATE_PATH = Deno.env.get('TEMPLATE_PATH') || './templates'
export const PAGE_PATH = Deno.env.get('PAGE_PATH') || './dist'

export async function readTemplate(name: string): Promise<string | null> {
    const path = TEMPLATE_PATH + `/${name}.html`
    if(!await exists(path)) 
        return null

    const file = await Deno.readTextFile(path)
    return file
}

export async function listTemplates(directory?: string): Promise<string[]> {
    const dir = directory ?? TEMPLATE_PATH
    const templates: string[] = []
    for await(const entry of Deno.readDir(dir)) {
        const next = dir + '/' + entry.name
    
        if(entry.isDirectory) {
            templates.push(...(await listTemplates(next)))
        } else if(entry.isFile && entry.name.endsWith('.html')) {
            templates.push(next)
        }

    }
    return templates
}

export async function readPage(name: string) {
    const path = PAGE_PATH + `/${name}.html`
    if(!await exists(path)) 
        return null

    const file = await Deno.readTextFile(path)
    return file
}