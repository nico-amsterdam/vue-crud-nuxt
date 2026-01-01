import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../database/schema'
import type { D1Database } from '@cloudflare/workers-types'

export { sql, eq, and, or, asc, relations } from 'drizzle-orm'

export const tables = schema

// 'npx wrangler types' generates type Env in worker-configuration.d.ts
// and server/types/env.d.ts imports Env

export function useDB(env: Env) {

  if (!env.DB) {
    throw createError(
      { statusCode: 500, statusMessage: 'Database not found in environment' })
  }

  return drizzle(env.DB as D1Database, { schema })
}