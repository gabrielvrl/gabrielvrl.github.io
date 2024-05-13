/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: "class",
	theme: {
		screens: {
			"max-sm": { max: "640px" },
		},
		extend: {},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}
