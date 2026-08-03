import { defineConfig, type UserConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import { resolve } from "path"
import { readdir } from "fs/promises"

async function explore(path: string): Promise<Record<string, string>> {
    const dir = await readdir(path, { recursive: true })
    const tree = {} as Record<string, string>
    
    for(const entry of dir) {
        if(entry.endsWith('.html')) {
            const parent = path.split('./routes/').at(1)!
            const name = entry.split('.html').at(0)!

            const index = (parent.length > 0) ? parent + '/' + name : name
            tree[index] = resolve(path, entry)
        }
    }

    return tree
}

export default defineConfig(async () => ({
    appType: 'mpa',
    plugins: [tailwindcss()],
    build: {
        emptyOutDir: true,
        outDir: '../dist',
        rolldownOptions: {
            input: await explore('./routes/')
        }
    },
    server: {
        host: '0.0.0.0'
    }
} satisfies UserConfig) )