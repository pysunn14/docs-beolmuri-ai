import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import remarkMermaid from './src/remark-mermaid.mjs';

export default defineConfig({
	site: 'https://pysunn.me',
	base: '/docs-beolmuri-ai',
	integrations: [react()],
	markdown: { remarkPlugins: [remarkMermaid] },
});
