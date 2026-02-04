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
    'nuxt-auth-utils',
    '@nuxtjs/i18n'
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
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', dir: 'ltr', name: "English", file: 'en.json' },
      { code: 'fr', iso: 'fr-FR', dir: 'ltr', name: "Français", file: 'fr.json' },
      { code: 'de', iso: 'de-DE', dir: 'ltr', name: "Deutsch", file: 'de.json' },
      { code: 'es', iso: 'es-ES', dir: 'ltr', name: "Español", file: 'es.json' }
    ],
    defaultLocale: 'en',
    lazy: false,
    langDir: 'locales/',
    strategy: 'no_prefix',
    detectBrowserLanguage: false,
    bundle: {
      optimizeTranslationDirective: false
    }
  },
  compatibilityDate: '2026-02-01'
});
