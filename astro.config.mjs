import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
	site: 'https://pysunn.me',
	base: '/docs-beolmuri-ai',
	integrations: [react()],
});
