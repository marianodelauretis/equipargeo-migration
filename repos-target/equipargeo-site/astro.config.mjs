import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://equipargeo.com',
  integrations: [
    tailwind({
      applyBaseStyles: false, // Usamos nuestro reset en src/styles/global.css
    }),
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
      customPages: [
        'https://app.equipargeo.com/',
        'https://app.equipargeo.com/posgar07/',
        'https://app.equipargeo.com/faja/',
        'https://app.equipargeo.com/puntos-intermedios/',
        'https://app.equipargeo.com/conversor-dxf/',
      ],
    }),
  ],
  build: {
    format: 'directory',
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
});
