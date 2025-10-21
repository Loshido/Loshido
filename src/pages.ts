import { exists } from "@std/fs/exists";

export const TEMPLATE_PATH = Deno.env.get('TEMPLATE_PATH') || './templates'
export const PAGE_PATH = Deno.env.get('PAGE_PATH') || './dist'
export const BLOG_PATH = Deno.env.get('BLOG_PATH') || './blog'

async function readFile(path: string) {
    if(!await exists(path)) 
        return null

    const file = await Deno.readTextFile(path)
    return file
}

export const readTemplate = (name: string) => 
    readFile(TEMPLATE_PATH + `/${name}.html`)

export const readPage = (name: string) => 
    readFile(PAGE_PATH + `/${name}.html`)

export const readArticle = (name: string) => 
    readFile(BLOG_PATH + `/${name}.md`)

export async function exploreArticles(directory?: string): Promise<string[]> {
    const dir = directory ?? BLOG_PATH
    const articles = []
    for await(const entry of Deno.readDir(dir)) {
        const next = dir + '/' + entry.name
    
        if(entry.isDirectory) {
            articles.push(...await exploreArticles(next))
        } else if(entry.isFile && entry.name.endsWith('.md')) {
            articles.push(next.slice(2, -3))
        }
    }
    return articles
}