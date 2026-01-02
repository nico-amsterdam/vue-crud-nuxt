import { sqliteTable, text, integer, unique } from 'drizzle-orm/sqlite-core'
import type { WebAuthnCredential } from '#auth-utils'
import { sql, relations } from "drizzle-orm"

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  username: text('username').notNull().unique(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  lastLoginAt: integer('last_login_at', { mode: 'timestamp_ms' }).notNull()
})

export const credentials = sqliteTable('credentials', {
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  id: text('id').notNull().primaryKey(),
  publicKey: text('public_key').notNull(),
  counter: integer('counter').notNull(),
  backedUp: integer('backed_up', { mode: 'boolean' }).notNull(),
  transports: text('transports', { mode: 'json' }).notNull().$type<WebAuthnCredential['transports']>()
}, table => [
  unique().on(table.userId, table.id)
]
)

export const products = sqliteTable('products', {
  id: integer('id').primaryKey(),
  productName: text('name').notNull().unique(),
  description: text('description').notNull(),
  price: integer('price'),
  createdBy: text('created_by').notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  modifiedBy: text('modified_by'),
  modifiedAt: integer("modified_at", { mode: "timestamp_ms" })
})

/**
 * Relations (useful for queries)
 */

export const usersRelations = relations(users, ({ many }) => ({
  credentials: many(credentials)
}))

export const credentialsRelations = relations(credentials, ({ one }) => ({
  user: one(users, {
    fields: [credentials.userId],
    references: [users.id]
  })
}))
