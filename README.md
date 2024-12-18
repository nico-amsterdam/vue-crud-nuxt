# Vue CRUD Nuxt

## About this project

Rebuild of this [Vue CRUD application](https://github.com/shershen08/vue.js-v2-crud-application) with [Nuxt 3](https://nuxtjs.org), [Pinia](https://pinia.vuejs.org) and [NuxtHub](https://hub.nuxt.com/).
There is a demo on https://vue-crud-nuxt.nuxt.dev/. This online demo does not require authentication and does not store changes. The change to NuxtHub was inspired by this [NuxtHub todo app](https://github.com/atinux/nuxt-todo-passkeys).

You can use this project as a starter and for demo's.
Download, clone or fork the source from https://github.com/nico-amsterdam/vue-crud-nuxt.

For authentication webauthn passwordless access is used. Currently the signup only asks for a username, but in practice you probably want to ask for an email address and do email verification before granting access.

[Sqlite](https://www.sqlite.org/index.html) is the central database.

Thanks to NuxtHub you can easily deploy to Cloudflare with the [D1](https://developers.cloudflare.com/d1/) database, so everything can run on the edge in the cloud.

Remove `middleware: 'auth'` from the Vue pages if you don't want authentication.

Remove the api calls in the Pinia store if you don't want database persistence.


## Instructions

- install node v23 or newer (https://nodejs.org/). This also installs npx
- install pnpm
- git clone this repostory, or download the source from github
- cd vue-crud-nuxt
- pnpm install --frozen-lockfile
- pnpm run db:generate
- pnpm run dev
- open browser http://localhost:3000/

Run with NuxtHub:
- run locally with:
  - npx nuxt build
  - npx nuxthub preview
- deploy on Cloudflare:
  - Required is a [NuxtHub](https://hub.nuxt.com/docs/getting-started) and a linked [Cloudflare](https://dash.cloudflare.com/login) account. There is a free tier
  - npx nuxthub deploy
