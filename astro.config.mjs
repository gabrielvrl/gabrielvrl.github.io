import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: 'https://gabrielvrl.github.io/',
  base: '/',
  integrations: [mdx(), react(), tailwind()],
  output: 'hybrid',
  adapter: node({
    mode: "standalone"
  })
});