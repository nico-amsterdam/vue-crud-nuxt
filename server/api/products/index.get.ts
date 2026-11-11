import { defineRouteMeta } from 'nitro'

/**
 * Build-time macro: extracted by Nitro when generating the OpenAPI spec.
 * The `Product` schema is defined here with `$global` so it is hoisted to the
 * top-level `components` section and can be referenced by the other routes
 * via `#/components/schemas/Product`.
 */
defineRouteMeta({
  openAPI: {
    tags: ['products'],
    summary: 'List products',
    description: 'Returns all products ordered by product name. Requires an authenticated session.',
    responses: {
      200: {
        description: 'List of products',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: { $ref: '#/components/schemas/Product' }
            }
          }
        }
      },
      401: { description: 'Unauthorized' }
    },
    $global: {
      components: {
        schemas: {
          Product: {
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'Unique product id' },
              productName: { type: 'string', maxLength: 20, description: 'Unique product name' },
              description: { type: 'string', maxLength: 300 },
              price: { type: 'integer', nullable: true },
              createdBy: { type: 'string', description: 'Username of the creator' },
              createdAt: { type: 'string', format: 'date-time' },
              modifiedBy: { type: 'string', nullable: true },
              modifiedAt: { type: 'string', format: 'date-time', nullable: true }
            },
            required: ['id', 'productName', 'description', 'createdBy', 'createdAt']
          }
        }
      }
    }
  }
})

export default eventHandler(async (event) => {
  await requireUserSession(event)

  const env = useRuntimeEnv(event)

  // List all products
  const products = await useDB(env).select().from(tables.products).orderBy(asc(tables.products.productName)).all()

  return products
})
