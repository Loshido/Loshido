import tailwind from "./services/tailwind.ts"
import { readArticlesMeta, PAGE_PATH } from "./services/pages.ts"


// build the css
await tailwind({ quiet: true, watch: false })

// build html pages in PAGE_PATH
await Deno.mkdir(PAGE_PATH, { recursive: true })
await Deno.mkdir(PAGE_PATH + '/blog', { recursive: true })

interface Tasks {
    [name: string]: {
        args?: any,
        generate: (args: any) => Promise<string | null>
    }
    [name: `blog/${string}`]: {
        args: string,
        generate: (id: string) => Promise<string | null>
    }
}

// Contains every route to render 
const tasks: Tasks = {
    // homepage
    'index': { 
        generate: (await import('./routes/index.ts')).default.generate
    }
}

// pushing every blog article
const articles = await readArticlesMeta()
const articleFactory = (await import('./routes/blog.ts')).default.generate
articles.forEach(article => tasks[`blog/${article.id}`] = {
    args: article.id,
    generate: articleFactory
})

// SSR to build SSG <=> unified rendering pipeline
for(const [name, { args, generate }] of Object.entries(tasks)) {
    const page = await generate(args)
    if(!page) throw new Error(`SSG failed for ${ name }`)

    const path = PAGE_PATH + '/' + name + '.html'
    Deno.writeTextFile(path, page)
    console.info(`${name} generated`)
}