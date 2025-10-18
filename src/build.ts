import tailwind from "./tailwind.ts"
import { explore } from "./main.ts"
import { PAGE_PATH } from "./pages.ts"

await tailwind({
    quiet: true,
    watch: false
})
const mods = await explore()

await Deno.mkdir(PAGE_PATH, {
    recursive: true
})

for(const mod of mods) {
    if(!mod.generate || !mod.name) continue
    const page = await mod.generate()
    if(!page) throw new Error(`SSG failed for ${ mod.name }`)

    const path = PAGE_PATH + '/' + mod.name + '.html'
    
    Deno.writeTextFile(path, page)

    console.info(`${mod.name} generated`)
}