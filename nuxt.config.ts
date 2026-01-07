import type { Nitro } from "nitropack";

export default defineNuxtConfig({
  ssr: false,
  css: ['@@/public/css/auth.css', '@@/public/css/bootstrap3-un.css'],
  srcDir: 'app',
  devtools: {
    enabled: true
  },
  typescript: {
    strict: true
  },
  modules: [[
    "@pinia/nuxt",
    {
      autoImports: [
        // automatically imports `defineStore`
        'defineStore', // import { defineStore } from 'pinia'
        // automatically imports `defineStore` as `definePiniaStore`
        ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
      ],
    },
  ]
    , 'nitro-cloudflare-dev'
    , 'nuxt-auth-utils'],

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
