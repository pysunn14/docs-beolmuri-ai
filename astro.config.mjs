// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://pysunn14.github.io',
	base: '/docs-beolmuri-ai',
	integrations: [
		starlight({
			title: '별무리 AI 문서',
		}),
	],
});
