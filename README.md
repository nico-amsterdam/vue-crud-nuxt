
Rebuild of [Vue CRUD application](https://github.com/shershen08/vue.js-v2-crud-application) with [Nuxt 3](https://nuxtjs.org) and [Pinia](https://pinia.vuejs.org).
Demo on https://vue-crud-nuxt.nuxt.dev/

## Instructions

- install node v23 or newer (https://nodejs.org/). This also installs npx
- install pnpm
- git clone this repostory
- cd vue-crud-nuxt
- cd frontend
- pnpm install
- pnpm run dev
- open browser http://127.0.0.1:3000/

Run with nuxthub:
- run locally with:
  - npx nuxthub preview
- deploy on cloudflare:
  - npx nuxthub deploy

It can also run without node on a static website:
- pnpm nuxt generate
which runs: ./node_modules/.bin/nuxt generate

or install nuxt globally with
- sudo pnpm install -g nuxt

and run:
- nuxt generate

  This creates everything in the .output/public directory.
  Put it in the document root directory of your webserver, or test it for example with live-server
  - sudo pnpm install -g live-server
  - cd .output/public
  - live-server
  - open browser http://127.0.0.1:8080/

