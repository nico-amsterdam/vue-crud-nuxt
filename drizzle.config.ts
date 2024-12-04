import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  schema: './server/database/schema.ts',
  out: './server/database/migrations',
  dbCredentials: {
     url: '.data/hub/d1/miniflare-D1DatabaseObject/LOOKUP-THE-FILE-AND-FILL-IN-HERE.sqlite'
  }
})
