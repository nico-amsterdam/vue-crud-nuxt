import type {Nitro} from "nitropack";

export default defineNuxtConfig({
  srcDir: 'app',
  devtools: {
    enabled: true
  },
  future: { compatibilityVersion: 4 },
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
      title: 'starter',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Vue CRUD Nuxt.js project' }
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
