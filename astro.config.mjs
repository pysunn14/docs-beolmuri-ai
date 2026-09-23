import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { unified } from '@astrojs/markdown-remark';
import rehypeMermaid from 'rehype-mermaid';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
	site: 'https://pysunn.me',
	base: '/docs-beolmuri-ai',
	integrations: [react()],
	markdown: {
		syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
		processor: unified({
			remarkPlugins: [remarkMath],
			rehypePlugins: [[rehypeMermaid, {
				strategy: 'inline-svg',
				mermaidConfig: { theme: 'dark', fontFamily: 'Arial, sans-serif' },
			}], rehypeKatex],
		}),
	},
});
