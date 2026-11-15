import { PRODUCT_PAGE_SIZE } from '#shared/utils/products'

/**
 * Build-time macro: extracted by Nitro when generating the OpenAPI spec.
 * The `Product` schema is defined with `$global` in `index.get.ts` and
 * referenced here via `#/components/schemas/Product`.
 */
defineRouteMeta({
  openAPI: {
    tags: ['products'],
    summary: 'Find products by name',
    description: 'Server-side search used when the product table has many rows. Returns the products whose name starts with the search phrase (case-insensitive), ordered by product name, starting after the given product name (cursor based pagination). PRODUCT_PAGE_SIZE + 1 rows are returned, so the client can detect whether more rows are available. Requires an authenticated session.',
    responses: {
      200: {
        description: 'List of matching products',
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
    }
  }
})

export default eventHandler(async (event) => {
  await requireUserSession(event)

  const env = useRuntimeEnv(event)
  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search : ''
  const from = typeof query.from === 'string' ? query.from : ''

  // Start searching after the last product name of the previous page
  const conditions = []
  if (from !== '') conditions.push(gt(tables.products.productName, from))
  // Search on the starting letters of the product name
  if (search !== '') {
    const pattern = toLikePattern(search) + '%'
    conditions.push(sql`${tables.products.productName} LIKE ${pattern} ESCAPE '\\'`)
  }

  const products = await useDB(env).select().from(tables.products)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(tables.products.productName))
    .limit(PRODUCT_PAGE_SIZE + 1)
    .all()

  return products
})
