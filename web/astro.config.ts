import { defineConfig } from 'astro/config';

import solidJs from '@astrojs/solid-js';

export default defineConfig({
    site: 'https://loshido.me',
    base: '/',
    integrations: [solidJs({ devtools: true })],
    outDir: '../dist'
});