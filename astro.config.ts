import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import deno from "@deno/astro-adapter";

import tailwindcss from '@tailwindcss/vite';

import og from 'astro-og';

// https://astro.build/config
export default defineConfig({
    site: 'https://loshido.me',
    integrations: [mdx(), sitemap(), og()],
    adapter: deno({
        port: 80
    }),
    output: 'server',
    server: {
        allowedHosts: ['echo'],
        port: 80
    },
    vite: {
        plugins: [...tailwindcss()]
    },
    markdown: {
        shikiConfig: {
            theme: 'github-dark-default'
        }
    }
});