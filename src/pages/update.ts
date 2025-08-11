import type { APIRoute } from "astro";
import update from "../services/update.ts";

const UPDATE_KEY = Deno.env.get('UPDATE_KEY')
if(!UPDATE_KEY) throw new Error('UPDATE_KEY has not been set')

export const GET: APIRoute = ({ clientAddress, request }) => {
    if(request.headers.get('Authorization') !== UPDATE_KEY) {
        return new Response(null, {
            status: 401
        })
    }
    const failed = update(clientAddress, request.signal)
    return new Response(failed, { status: 500 })
}