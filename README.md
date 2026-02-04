# Vue CRUD Nuxt

## About this project

Rebuild of this [Vue CRUD application](https://github.com/shershen08/vue.js-v2-crud-application) with [Nuxt 4](https://nuxtjs.org) and [Pinia](https://pinia.vuejs.org), with the option to deploy it on Cloudflare, so everything can run on the edge in the cloud.
There is a demo on https://vue-crud-nuxt.nuxt.dev/. The online demo does not require authentication and does not store changes.

You can use this project as a starter for your Nuxt application. Nuxt offers features like a router, Server-side rendering with hydration, and a git based CMS with a [free editor](https://content.nuxt.com/blog/studio-oss).
Download, clone or fork the source from https://github.com/nico-amsterdam/vue-crud-nuxt.

For authentication WebAuthn passwordless access is used. Currently the signup only asks for a username, but in practice you probably want to ask for an email address and do email verification before granting access.
This functionality is powered by [nuxt-auth-utils](https://nuxt.com/modules/auth-utils). Nuxt-auth-utils also supports OAuth/OIDC for many providers, so with a bit of work you can use those as well.

[Sqlite](https://www.sqlite.org/index.html) is the central database. More specifically [Cloudflare D1](https://developers.cloudflare.com/d1/worker-api/d1-database/).
D1 is a managed database with automatic backups (Time Travel).
It is great for most CRUD applications. There are a few limitations; D1 has a maximum size of 10 GB per instance (5 GB in the free plan) and it does't support transactions with multiple steps, though it does support atomic batch operations.

Remove `middleware: 'auth'` from the Vue pages and `requireUserSession` from the server api if you don't want authentication.

Remove the api calls in the Pinia store if you don't want database persistence.

## Directory structure

```text
├── app/
│   ├── components/
│   ├── layouts/
│   ├── middleware/
│   ├── pages/
│   │   └── product/
│   │       └── [id]/
│   └── stores/
├── public/
│   ├── css/
│   └── image/
├── server/
│   ├── api/
│   │   ├── products/
│   │   └── webauthn/
│   ├── database/
│   │   └── migrations/
│   ├── types/
│   └── utils/
├── shared/
│   └── types/
└── tests/
    └── stores/
```


## Instructions

- install [Bun](https://bun.com/). Other package managers like pnpm can also be used, but the Bun package manager is faster.
- install [Node](https://nodejs.org/en/download). I recommend using nvm for the installation of Node.
- git clone this repostory, or download the source from github.

  `git clone https://github.com/nico-amsterdam/vue-crud-nuxt.git`
- `cd vue-crud-nuxt`
- `cp .env.example .env`
- Fill in the NUXT_SESSION_PASSWORD in the .env file. You can use a random 32 hex string (`xxd -p -l 32 -c 32 /dev/urandom`).
- `bun install`
- `cp wrangler.jsonc.example wrangler.jsonc`
- `bun update:types`
- `bun migrate:create`                  # run this again after making changes in schema.ts
- `bun migrate:dev`
- `bun dev`
- open browser http://localhost:3000/   # Nuxt DevTools is available at the bottom of the page

After code changes run:
- `bun typecheck`
- `bun test`                            # For coverage report: `bun test --coverage`. Fancy test ui: `bun vitest:ui`

Preview mode:
- `bun run build`
- `bun preview`                         # A preview is without Nuxt DevTools
- open browser http://localhost:8787/   # Uses the same local database as with `bun dev`

Deploy on Cloudflare:
  - Required is a [Cloudflare](https://dash.cloudflare.com/login) account. There is a free tier
  - Fill in your Cloudflare ID in wrangler.jsonc and in the .env file
  - `bun wrangler login`
  - `bun create:db`       # interactive. Fill in DB for the database binding. Adds the binding in wrangler.jsonc
  - `bun create:kv`       # Adds the binding in wrangler.jsonc
  - Remove double binding entries from wrangler.jsonc, but do not delete the `migrations_dir` property
  - `bun migrate`
  - `bun secret:nuxt`     # Use a random 32 bytes hex string
  - `bun run build`
  - `bun deploy:app`

## Tips

- Run `bun logtail` to view the log of the application running on Cloudflare
- Run `bun studio:db` to view the production database with Drizzle Studio. Needs the Cloudflare environment settings in the .env file. Create the Cloudflare token with the following additional account permissions: D1:Edit, Workers KV Storage:Edit
- The content of the local database can be quickly viewed with `bun dbcat:db:dev` and the Key-Value store with `bun dbcat:kv:dev`
- If you define a CLOUDFLARE_API_TOKEN environment variable in the .env file, wrangler will use automatically this token (instead of `wrangler login`). Make sure that the token has enough permissions.

<img width="358" height="177" alt="image" src="https://github.com/user-attachments/assets/b9a2d706-d591-4eaf-9202-7965f91988f5" />


## Troubleshooting

### Database reconnection

- If the remote database is deleted (`bun wrangler d1 delete vue-crud-nuxt`) and created again, and there are errors (like: `Error: 7500: You do not have permission to perform this operation`) when doing queries then reconnect the worker with the correct database in the [Cloudflare dashboard](https://dash.cloudflare.com/):

<img width="495" height="273" alt="image" src="https://github.com/user-attachments/assets/4cfb4dfa-cdb7-4e0e-aaeb-4b4d65d33dec" />


