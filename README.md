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

- install [bun](bun.com). Other package managers like pnpm can also be used, but the bun package manager is faster. Use the `bunx` command instead of `npx` 
- git clone this repostory, or download the source from github
- cd vue-crud-nuxt
- cp wrangler.jsonc.example wrangler.jsonc
- Fill in your Cloudflare ID in wrangler.jsonc
- cp .env.example .env
- Fill in the details in .env
- bun install
- bun run update:types
- bun run build
- bun run create:db    # interactive. Fill in DB for the database binding. Adds the binding in wrangler.jsonc
- bun run create:kv    # Adds the binding in wrangler.jsonc
- bun run generate:db
- bun run migrate:dev
- bun run dev
- open browser http://localhost:3000/    # Nuxt DevTools is available at the bottom of the page

After code changes run:
- bun run typecheck

Preview mode:
- bun run preview                        # A preview is without Nuxt DevTools
- open browser http://localhost:8787/    # Uses the same local database as with `bun run dev`

Deploy on Cloudflare:
  - Required is a [Cloudflare](https://dash.cloudflare.com/login) account. There is a free tier
  - bun run migrate
  - bun run secret:nuxt                  # Use a random 32 bytes hex string
  - bun run deploy:app

## Tips

- Run `bun run logtail` to view the log of the application running on Cloudflare
- If the remote database is deleted (`bun wrangler d1 delete vue-crud-nuxt`) and created again, and there are errors (like: `Error: 7500: You do not have permission to perform this operation`) when doing queries then reconnect the worker with the correct database in the (Cloudflare dashboard)[dash.cloudflare.com]:

<img width="495" height="273" alt="image" src="https://github.com/user-attachments/assets/4cfb4dfa-cdb7-4e0e-aaeb-4b4d65d33dec" />

