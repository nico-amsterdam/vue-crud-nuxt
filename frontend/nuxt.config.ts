export default defineNuxtConfig({
  typescript: {
    strict: true
  },

  modules: [
    [
      "@pinia/nuxt",
      {
        autoImports: [
      // automatically imports `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
      // automatically imports `defineStore` as `definePiniaStore`
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'        
        ],
      },
    ],
  ],

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
      ],
      link: [
          { rel:  'stylesheet prefetch', 
            href: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css' }
        , { rel:  'stylesheet prefetch',
            href: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap-theme.min.css'}
      ]
    }    
  },

  imports: {
    dirs: ['stores']
  },

  compatibilityDate: '2024-09-17'
});