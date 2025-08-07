import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import deno from "@deno/astro-adapter"

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://loshido.me',
  integrations: [mdx(), sitemap()],
  adapter: deno(),
  output: 'server',

  vite: {
    plugins: [tailwindcss()]
  }
});