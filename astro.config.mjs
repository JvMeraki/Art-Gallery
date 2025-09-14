// @ts-check
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: "https://jv-art-gallery.vercel.app/en/",
  base: "/",
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [react()],
  i18n: {
    locales: ["es", "en", "fr", "it", "pt", "kr"],
    defaultLocale: "en",
  }
});