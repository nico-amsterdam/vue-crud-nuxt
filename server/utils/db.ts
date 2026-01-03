import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../database/schema'

// Files in server/utils are auto imported by Nuxt in the source files,
// so these do not have to be imported again:
export { eq, and, or, asc } from 'drizzle-orm'

export const tables = schema

// 'npx wrangler types' generates type Env in worker-configuration.d.ts
// and server/types/env.d.ts imports Env

export function useDB(env: Env) {

  if (!env.DB) {
    throw createError(
      { statusCode: 500, statusMessage: 'Database not found in environment' })
  }

  return drizzle(env.DB, { schema })
}
