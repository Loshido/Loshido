import tailwind from "./tailwind.ts"
import { exploreArticles, PAGE_PATH } from "./pages.ts"


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
}

// Contains every route to render 
const tasks: Tasks = {
    // homepage
    'index': { 
        generate: (await import('./routes/index.ts')).default.generate
    }
}

// pushing every blog article
const articles = await exploreArticles()
const articleFactory = (await import('./routes/blog.ts')).default.generate
articles.forEach(article => tasks[article] = {
    args: { id: article },
    generate: articleFactory
})

console.log(articles)

// SSR to build SSG <=> unified rendering pipeline
for(const [name, { args, generate }] of Object.entries(tasks)) {
    const page = await generate(args)
    if(!page) throw new Error(`SSG failed for ${ name }`)

    const path = PAGE_PATH + '/' + name + '.html'
    Deno.writeTextFile(path, page)
    console.info(`${name} generated`)
}