import { exists } from "@std/fs/exists";
import { parse } from "@std/yaml/parse"

export const TEMPLATE_PATH = './templates'
export const PAGE_PATH = './dist'
export const BLOG_PATH = './blog'
export const BLOG_MANIFEST_PATH = './blog/manifest.yml'

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


export interface ArticleMeta {
    id: string,
    title: string,
    desc: string,
    date?: string,
    image?: string
}

export async function readArticlesMeta(): Promise<ArticleMeta[]> {
    const manifestPath = await Deno.readTextFile(BLOG_MANIFEST_PATH)
    if(!manifestPath) throw new Error(`Could'nt read blog's manifest (at ${BLOG_MANIFEST_PATH})`)
    const manifest = parse(manifestPath) as Record<string, Omit<ArticleMeta, 'id'>>

    return Object.entries(manifest).map(([id, meta]) => ({
        ...meta,
        id
    }))
}

export async function readArticleMeta(id: string): Promise<ArticleMeta | null> {
    const articles = await readArticlesMeta()
    return articles.find(article => article.id === id) || null
}