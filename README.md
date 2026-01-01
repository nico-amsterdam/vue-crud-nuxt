# Vue CRUD Nuxt

## About this project

Rebuild of this [Vue CRUD application](https://github.com/shershen08/vue.js-v2-crud-application) with [Nuxt 4](https://nuxtjs.org) and [Pinia](https://pinia.vuejs.org).
There is a demo on https://vue-crud-nuxt.nuxt.dev/. The online demo does not require authentication and does not store changes.

You can use this project as a starter and for demo's.
Download, clone or fork the source from https://github.com/nico-amsterdam/vue-crud-nuxt.

For authentication webauthn passwordless access is used. Currently the signup only asks for a username, but in practice you probably want to ask for an email address and do email verification before granting access.

[Sqlite](https://www.sqlite.org/index.html) is the central database.

Deploy easily to Cloudflare with the [D1](https://developers.cloudflare.com/d1/) database, so everything can run on the edge in the cloud.

Remove `middleware: 'auth'` from the Vue pages and `requireUserSession` from the server api if you don't want authentication.

Remove the api calls in the Pinia store if you don't want database persistence.

## Instructions

- install bun. Other package managers like pnpm can also be used, but the bun package manager is faster. Use the `bunx` command instead of `npx` 
- git clone this repostory, or download the source from github
- cd vue-crud-nuxt
- bun install
- bun run update:types
- bun run build
- bun run create:db    # interactive. Fill in DB for the database binding
- bun run create:kv
- bun run db:generate
- bun run migrate:dev
- bun run dev
- open browser http://localhost:3000/

After code changes run:
- bun run typecheck

Deploy on Cloudflare:
  - Required is a [Cloudflare](https://dash.cloudflare.com/login) account. There is a free tier
  - bun run migrate
  - bun run secret:nuxt
  - bun run deploy:app
