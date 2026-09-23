// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://pysunn.me',
	base: '/docs-beolmuri-ai',
	integrations: [
		starlight({
			title: '별무리 AI',
			logo: { src: './src/assets/star.svg', alt: '' },
			locales: { root: { label: '한국어', lang: 'ko' } },
			customCss: ['./src/styles/theme.css'],
			credits: false,
		}),
	],
});
