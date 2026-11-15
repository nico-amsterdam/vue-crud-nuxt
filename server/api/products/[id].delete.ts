import { useValidatedParams, zh } from 'h3-zod'

defineRouteMeta({
  openAPI: {
    tags: ['products'],
    summary: 'Delete a product',
    description: 'Deletes a product by id and returns it. Requires an authenticated session.',
    parameters: [
      {
        in: 'path',
        name: 'id',
        required: true,
        schema: { type: 'integer' },
        description: 'Product id'
      }
    ],
    responses: {
      200: {
        description: 'The deleted product, or null if it did not exist',
        content: {
          'application/json': {
            schema: {
              allOf: [
                { $ref: '#/components/schemas/Product' }
              ],
              nullable: true
            }
          }
        }
      },
      401: { description: 'Unauthorized' }
    }
    // Cast needed: nitropack's internal OpenAPI 3.1 types do not (yet) accept
    // a nullable schema combined with allOf.
  } as unknown as Parameters<typeof defineRouteMeta>[0]['openAPI']
})

export default eventHandler(async (event) => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString
  })
  await requireUserSession(event)

  const env = useRuntimeEnv(event)

  // Delete product
  const deletedProduct = await useDB(env).delete(tables.products).where(
    eq(tables.products.id, id)
  ).returning().get()

  return deletedProduct
})
