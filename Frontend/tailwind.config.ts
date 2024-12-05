import type { Config } from 'tailwindcss';
import plugin from 'flowbite/plugin'

export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				primary: { "50": "#ecfeff", "100": "#cffafe", "200": "#a5f3fc", "300": "#67e8f9", "400": "#22d3ee", "500": "#06b6d4", "600": "#0891b2", "700": "#0e7490", "800": "#155e75", "900": "#164e63" },
				"color-dark": "var(--color-dark)",
				'color-on-dark': "var(--color-on-dark)",
			},
		}
	},

	plugins: [plugin]
} satisfies Config;
