# Vue CRUD Nuxt

## Features

- ⛅ **Cloud**: Deploy to Cloudflare without any hassle
- 🔐 **Authentication**: Login with WebAuthn. No API keys needed to setup.
- 🧩 **Web framework**: Vue with TypeScript
- 📝 **Template system**: Clean separation of HTML and JavaScript logic. Built-in directives (v-if, v-for, v-bind, v-model)
- 🏭 **Full stack**: Nuxt provides file-based routing, auto-imports, and server-side rendering
- 🌳 **Rich ecosystem**: Vue has several component frameworks. Vue and Nuxt have DevTools and many plugins
- 💾 **Database**: Drizzle ORM with SQLite
- 🔄 **Migrations**: Database migration system
- ☎  **Mobile compatible**: Responsive web design. Manifest enables 'Add to Home Screen'
- 🕶 **Accessible**: Follows WCAG and WAI-ARIA standards for accessibility
- 🌐 **Internationalization**: Switch between different languages
- 🛡️ **Security**: Secured & sealed cookies, fetch metadata checks
- 🚀 **Ready to launch**: Skip the scaffolding. Get straight to implementing your business ideas

## Wireframe

```text
+-------------------------------------------------------------+
| Vue CRUD Nux             ☼☽       [User] [Log Out] [Lang ▼] |
+-------------------------------------------------------------+
| [+ Add product]                                 [↻ Refresh] |
| Search: [_________________________] (updates as you type)   |
+-------------------------------------------------------------+
| Name       | Description |     Price | Actions              |
|------------|-------------|-----------|----------------------|
| product2   | 2nd         |  102.78 € | [Edit] [Delete]      |
| product3   | 3rd         |    5.09 € | [Edit] [Delete]      |
| product4   | 4th         | 9000.22 € | [Edit] [Delete]      |
| product5   | 5th         |   55.55 € | [Edit] [Delete]      |
| product6   | 6th         |    2.99 € | [Edit] [Delete]      |
+-------------------------------------------------------------+
```

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

For a safe content-security-policy I am waiting for this [PR](https://github.com/nuxt/nuxt/pull/32242).

## Directory structure

```text
├── app/                      # client-side app
│   ├── components/           # shared components
│   ├── layouts/              # shared layouts
│   ├── middleware/           # middleware: auth
│   ├── pages/                # routes with Vue files
│   │   └── product/[id]/     # edit/delete product
│   └── stores/               # Pinia stores; cache and interface with backend
├── public/                   # public assets
│   ├── css/                  # stylesheets
│   └── image/                # images
├── i18n/                     # internationalization
│   ├── locales/              # client-side translations
│   └── server-translations/  # server-side translations
├── server/                   # server-side code
│   ├── api/                  # public apis
│   │   ├── products/         # products api
│   │   └── webauthn/         # WebAuthn api
│   ├── database/             # database schema
│   │   └── migrations/       # database migrations (generated)
│   ├── middleware/           # middleware: security headers handler
│   ├── types/                # server types: Env
│   └── utils/                # auto imported functions
├── shared/types/             # shareed types: User
└── tests/                    # unit tests
```


## Instructions

- install [Bun](https://bun.com/). Other package managers like pnpm can also be used, but the Bun package manager is faster.
- install [Node](https://nodejs.org/en/download). I recommend using nvm for the installation of Node.
- [Create a GitHub project with this template](https://github.com/nico-amsterdam/vue-crud-nuxt/generate) and get the project without git history. Or download, clone or fork the source code.

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

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun update:types` | Generate TypeScript types from your Cloudflare Worker configuration |
| `bun run build` | Bundle everything for preview and deploy |
| `bun typecheck` | Run TypeScript type checking without emitting files |
| `bun typecheck:watch` | Run TypeScript type checking in watch mode |
| `bun create:kv` | Create a new Cloudflare key-value store |
| `bun create:db` | Create a new Cloudflare D1 database |
| `bun migrate:create` | Generate database migration files using Drizzle Kit |
| `bun migrate:dev` | Apply database migrations to local development database |
| `bun migrate` | Apply database migrations to remote production database |
| `bun test:db:dev` | Test local development database connection and query products table |
| `bun test:db` | Test remote production database connection and query products table |
| `bun vitest` | Run tests |
| `bun vitest:ui` | Start UI to run tests |
| `bun dev` | Start local development server with DevTools |
| `bun preview` | Start local development server without DevTools |
| `bun secret:nuxt` | Set Nuxt password for encrypted cookies |
| `bun logtail` | Stream real-time logs from deployed Cloudflare Worker |
| `bun rollback:app` | Rollback to previous deployment version |
| `bun delete:app` | Delete the deployed Cloudflare Worker |
| `bun databases` | List all Cloudflare D1 databases |
| `bun kv-workers` | List all Cloudflare KV workers |
| `bun studio:db` | Open Drizzle Studio for production database management |
| `bun studio:db:dev` | Open Drizzle Studio for local development database |
| `bun studio:kv:dev` | Open Drizzle Studio for local key-value store |
| `bun introspect:db` | Introspect database schema using Drizzle Kit |
| `bun dbcat:db:dev` | View local development database content using dbcat CLI tool |
| `bun dbcat:kv:dev` | View local key-value store content using dbcat CLI tool |


## Troubleshooting

### Database reconnection

If the remote database is deleted (`bun wrangler d1 delete vue-crud-nuxt`) and recreated, you may encounter errors like:
```
Error: 7500: You do not have permission to perform this operation
```

To fix, reconnect the worker with the correct database in the [Cloudflare dashboard](https://dash.cloudflare.com/):
1. Go to Workers & Pages → vue-crud-nuxt → Bindings
2. In the table with types, click the edit button for the D1 Database
3. Reconnect the worker with the correct database

<img width="495" height="273" alt="image" src="https://github.com/user-attachments/assets/4cfb4dfa-cdb7-4e0e-aaeb-4b4d65d33dec" />

### Common Errors

- **Migration failures**: Ensure `DB_ID` in `.env` matches the database_id in `wrangler.jsonc`

