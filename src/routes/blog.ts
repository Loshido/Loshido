import { readArticle, readArticleMeta, readPage, readTemplate } from "../services/pages.ts";
import Mizu from "@mizu/render/server"
import { render } from "@deno/gfm"

export default {
    path: '/blog/:id',
    handle(mode) {
        return async (_, url) => {
            const id = url.pathname.groups.id as string | undefined
            if(!id) return 'next'

            const page = mode === 'ssr' 
                ? await this.generate!(`blog/${id}`) 
                : await readPage(`blog/${id}`)
            if(!page) return 'next'
    
            return new Response(page, {
                headers: {
                    'Content-Type': 'text/html'
                }
            })
        }
    },
    name: 'blog',
    async generate(id) {
        if(!id) return ''
        id = id.startsWith('blog/') ? id.slice(5) : id

        const article = await readArticle(id)
        const meta = await readArticleMeta(id)
        
        const template = await readTemplate('blog')
        const back = await Deno.readTextFile('./templates/back.svg')
        const commit = Deno.env.get('GIT_HEAD') || '?'
        if(!article || !template || !meta || !back) return null

        const rendered = render(article, {
            allowIframes: true
        })

        return await Mizu.render(template, {
            context: {
                commit,
                ...meta,
                article: rendered,
                back
            }
        })
    }
} satisfies Route<string>