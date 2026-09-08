import { defineConfig } from 'astro/config';
export default defineConfig({ output: 'static', site: process.env.SITE_URL || 'https://seizure-termination.github.io', base: process.env.BASE_PATH || '/', trailingSlash: 'always', build: { format: 'directory' }, server: { host: '127.0.0.1', port: 4321 } });
