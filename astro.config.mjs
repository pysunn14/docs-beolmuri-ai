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
			head: [{
				tag: 'script',
				content: "if (!localStorage.getItem('starlight-theme')) localStorage.setItem('starlight-theme', 'dark');",
			}],
			components: { Header: './src/components/Header.astro' },
			sidebar: [
				{ label: '시작', items: [{ slug: '' }, { slug: 'start' }] },
				{ label: '설계', items: [{ slug: 'design' }] },
				{ label: '평가', items: [{ slug: 'evaluation' }] },
				{ label: '기록', items: [{ slug: 'notes' }] },
			],
			credits: false,
		}),
	],
});
