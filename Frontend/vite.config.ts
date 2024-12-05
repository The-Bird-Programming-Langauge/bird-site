import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	optimizeDeps: {
		exclude: ["svelte-codemirror-editor", "codemirror", "@codemirror/language-javascript" /* ... */],
	},
	plugins: [sveltekit()]
});
