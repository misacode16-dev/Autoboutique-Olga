// @ts-check
import sitemap from "@astrojs/sitemap";
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
   site: "https://autoboutiqueolga.com",

  trailingSlash: "always",  //ignore


   integrations: [
    sitemap({
      filter: (page) => {
        // Excluir búsqueda interna y filtros (marca, modelo, etc.)
        // Detecta URLs con query params: ?q=, ?marca=, ?modelo=, etc.
        const hasQueryParams = page.includes("?");

        // Excluir la página de búsqueda sin query (por si existe /buscar)
        const isSearchPage = page.includes("/buscar");

        return !hasQueryParams && !isSearchPage;
      },
    }),
  ],


  
    vite: {
    plugins: [tailwindcss()],
  },
});
