import { readPage, readTemplate } from "../pages.ts";
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
    async generate() {
        const template = await readTemplate('index')
        const heading = await Deno.readTextFile('./templates/heading.svg')
        if(!template) return null

        return await Mizu.render(template, {
            context: {
                heading
            }
        })
    }
} satisfies Route