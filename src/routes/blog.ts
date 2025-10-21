import { readArticle, readPage } from "../pages.ts";
import Mizu from "@mizu/render/server"

export default {
    path: '/blog/:id',
    handle(mode) {
        return async (_, url) => {
            const id = url.pathname.groups.id as string | undefined
            if(!('id' in url.pathname.groups) || !id) return 'next'

            const page = mode === 'ssr' 
                ? await this.generate!({ id }) 
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
    async generate(args) {
        if(!args) return ''
        const id = args.id.startsWith('blog/') ? args.id.slice(5) : args.id

        const article = await readArticle(id)
        if(!article) return null
        const date = new Date().toLocaleDateString('fr-FR', {
            dateStyle: 'medium'
        })
        const commit = Deno.env.get('GIT_HEAD') || '7198db5b4ce36d3c0641764c2848d2252d3a4924'

        return await Mizu.render(article, {
            context: {
                date,
                commit,
                id
            }
        })
    }
} satisfies Route<{ id: string }>