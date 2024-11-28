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
  ], '@nuxthub/core'
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
        { hid: 'description', name: 'description', content: 'Vue CRUD Nuxt.js project' }
      ]
    }    
  },
  auth: {
    webAuthn: true
  },
  hub: {
    database: true,
    kv: true
  },
  experimental: {
    inlineSSRStyles: true
  },
  addMeta: true,

  imports: {
    dirs: ['stores']
  },

  compatibilityDate: '2024-09-17'
});
