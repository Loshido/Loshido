import type { APIRoute } from "astro";
import { checkout } from "../services/git.ts"
import rebuild from "../services/rebuild.ts"

export const GET: APIRoute = ({ clientAddress, request }) => {
    if(request.headers.get('Authorization') !== Deno.env.get('UPDATE_KEY')) {
        return new Response(null, {
            status: 401
        })
    }

    const time = new Date().toLocaleTimeString('fr-FR', { timeStyle: 'medium' })
    console.log(`%c${time}%c Update %cinitiated%c by ${clientAddress}`, 'color: #0004', 'color: #fff', 'color: #70ffaf', 'color: #fff')
    
    const updated = checkout(request.signal)
    if(!updated) return new Response('failed to checkout', { status: 500 })
    
    const rebuilt = rebuild(request.signal)
    if(!rebuilt) return new Response('failed to rebuild', { status: 500 })

    console.info('Checkout & Rebuilt %csuccessfully', "color: #70ffaf")
    
    Deno.exit(2)
}