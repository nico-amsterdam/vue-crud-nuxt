import { PRODUCT_PAGE_SIZE } from '#shared/utils/products'

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
    description: 'Returns the first page of products ordered by product name. PRODUCT_PAGE_SIZE + 1 rows are returned, so the client can detect whether more rows are available. Requires an authenticated session.',
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
    // Cast needed: nitropack's internal OpenAPI 3.1 types do not (yet) include
    // the JSON Schema validation keywords used in these schemas.
  } as unknown as Parameters<typeof defineRouteMeta>[0]['openAPI']
})

export default eventHandler(async (event) => {
  await requireUserSession(event)

  const env = useRuntimeEnv(event)

  // List the first page of products; the extra row tells the client
  // if there are more rows, so it can switch to server-side search
  // and load more rows while scrolling.
  const products = await useDB(env).select().from(tables.products)
    .orderBy(asc(tables.products.productName))
    .limit(PRODUCT_PAGE_SIZE + 1)
    .all()

  return products
})
