import type { Nitro } from "nitropack";

export default defineNuxtConfig({
  srcDir: 'app',
  ssr: false,
  css: ['@@/public/css/auth.css', '@@/public/css/bootstrap3-un.css'],
  devtools: {
    enabled: true
  },
  typescript: {
    strict: true
  },
  modules: [
    '@pinia/nuxt',
    'nuxt-auth-utils'
  ],
  app: {
    /*
    ** Headers of the page
    */
    head: {
      title: 'Vue CRUD Nuxt',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Vue CRUD Nuxt.js project' },
        { name: 'theme-color', content: '#fddcd0' }
      ]
    }
  },
  auth: {
    webAuthn: true
  },
  imports: {
    // Auto-import pinia stores defined in `~/stores`
    dirs: ['stores']
  },
  nitro: {
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  },
  hooks: {
    'nitro:build:before': (nitro: Nitro) => {
      nitro.options.moduleSideEffects.push('reflect-metadata')
    }
  },
  compatibilityDate: '2025-12-15'
});
