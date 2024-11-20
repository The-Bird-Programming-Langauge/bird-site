import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				"dark": "var(--dark)",
				"medium-light": "var(--medium-light)",
				"light": "var(--light)",
				"primary": "var(--primary)",
				"accent": "var(--accent)",
			},
		}
	},

	plugins: []
} satisfies Config;
