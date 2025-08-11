import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ clientAddress, request }) => {
    if(request.headers.get('Authorization') !== Deno.env.get('MASTER_KEY')) {
        return new Response(null, {
            status: 401
        })
    }

    const time = new Date().toLocaleTimeString('fr-FR', { timeStyle: 'medium' })
    console.log(`%c${time}%c Rebuild %cinitiated%c by ${clientAddress}`, 'color: #0004', 'color: #fff', 'color: #70ffaf', 'color: #fff')
    const cmd = new Deno.Command("deno", {
        args: ["task", "build"],
        signal: request.signal,
        stdout: "inherit",
        stderr: "inherit",
        stdin: 'null'
    })


    const output = await cmd.output()
    if(!output.success) {
        return new Response(null, { status: 500 })
    }

    console.info('Rebuilt %csuccessfully', "color: #70ffaf")
    
    Deno.exit(2)
}