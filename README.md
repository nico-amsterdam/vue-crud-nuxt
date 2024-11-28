
Rebuild of [Vue CRUD application](https://github.com/shershen08/vue.js-v2-crud-application) with [Nuxt 3](https://nuxtjs.org) and [Pinia](https://pinia.vuejs.org).
Demo on https://vue-crud-nuxt.nuxt.dev/

## Instructions

- install node v23 or newer (https://nodejs.org/). This also installs npx
- install pnpm
- git clone this repostory
- cd vue-crud-nuxt
- pnpm install
- pnpm run db:generate
- pnpm run dev
- open browser http://127.0.0.1:3000/
- npx nuxthub database migrations mark-all-applied

Run with nuxthub:
- run locally with:
  - npx nuxthub preview
- deploy on cloudflare:
  - npx nuxthub deploy
