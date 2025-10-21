import { readPage, readTemplate } from "../services/pages.ts";
import Mizu from "@mizu/render/server"

export default {
    path: '/',
    handle(mode) {
        return async () => {
            const page = mode === 'ssr' ? await this.generate!() : await readPage('index')
            if(!page) return 'next'
    
            return new Response(page, {
                headers: {
                    'Content-Type': 'text/html'
                }
            })
        }
    },

    name: 'index',
    async generate(_args: undefined) {
        const template = await readTemplate('index')
        const heading = await Deno.readTextFile('./templates/heading.svg')
        const yama = await Deno.readTextFile('./templates/yama.svg')
        const date = new Date().toLocaleDateString('fr-FR', {
            dateStyle: 'medium'
        })
        const commit = Deno.env.get('GIT_HEAD') || '?'
        if(!template) return null

        return await Mizu.render(template, {
            context: {
                heading,
                date,
                commit,
                yama
            }
        })
    }
} satisfies Route<undefined>