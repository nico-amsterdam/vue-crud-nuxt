export default defineNuxtConfig({
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
  ], '@nuxthub/core'],

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
  css: [
    // bootstrap3 + theme via uncss
    '~/assets/css/bootstrap3-un.css'
  ],
  experimental: {
    inlineSSRStyles: true
  },

  addMeta: true,

  imports: {
    dirs: ['stores']
  },

  compatibilityDate: '2024-09-17'
});
