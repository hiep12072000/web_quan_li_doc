// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'in-out' },
  },
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-icon'],
  build: {
    transpile: ['trpc-nuxt'],
  },
  typescript: {
    shim: false,
  },
  tailwindcss: {
    exposeConfig: true,
  },
});
