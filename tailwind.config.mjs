/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    screens: {
      "max-sm": { max: "640px" },
      "max-md": { max: "760px" },
    },
    extend: {
      animation: {
        "slideIn-stop": "slideIn-stop 1s forwards",
        slideOut: "slideOut 1s forwards",
      },
      keyframes: {
        "slideIn-stop": {
          "0%": {
            transform: "translateY(-100%)",
            opacity: 0,
          },
          "50%": {
            opacity: 1,
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        slideOut: {
          "0%": {
            transform: "translateY(0)",
            opacity: 1,
          },
          "50%": {
            opacity: 1,
          },
          "100%": {
            transform: "translateY(-100%)",
            opacity: 0,
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
