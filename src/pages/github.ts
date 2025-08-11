import type { APIRoute } from "astro";
import update from "../services/update.ts"
import { verifySignature } from "../services/git.ts";

const GITHUB_WEBHOOK = Deno.env.get('GITHUB_WEBHOOK')
if(!GITHUB_WEBHOOK) throw new Error('GITHUB_WEBHOOK has not been set')

export const POST: APIRoute = async  ({ request }) => {
    const event = request.headers.get('X-Github-Event')
    if(event !== 'push') return new Response(null, { status: 400 })
        
    const body = await request.json()
    const signature = request.headers.get('X-Hub-Signature-256')?.split('=').at(1)
    if(!signature || !(await verifySignature(GITHUB_WEBHOOK, signature, JSON.stringify(body)))) {
        return new Response(null, { status: 401 })
    }


    const time = new Date().toLocaleTimeString('fr-FR', { timeStyle: 'medium' })
    console.log(`%c${time}%c [Webhook] Push event (${ body.pusher.name })`, 'color: #0004', 'color: #fff')
    
    const failed = update(body.pusher.name, request.signal)
    return new Response(failed, { status: 500 })
}