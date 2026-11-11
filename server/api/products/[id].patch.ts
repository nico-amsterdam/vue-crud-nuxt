import { defineRouteMeta } from 'nitro'
import { useValidatedParams, useValidatedBody, z, zh } from 'h3-zod'

defineRouteMeta({
  openAPI: {
    tags: ['products'],
    summary: 'Update a product',
    description: 'Updates a product with optimistic locking: `modifiedAt` must match the current value, otherwise the update is rejected. Requires an authenticated session.',
    parameters: [
      {
        in: 'path',
        name: 'id',
        required: true,
        schema: { type: 'integer' },
        description: 'Product id'
      }
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              productName: { type: 'string', minLength: 1, maxLength: 20 },
              description: { type: 'string', minLength: 1, maxLength: 300 },
              price: { type: 'number', exclusiveMinimum: 0, nullable: true },
              modifiedAt: { type: 'string', format: 'date-time', nullable: true, description: 'Current modifiedAt of the product, used for conflict detection' }
            },
            required: ['productName', 'description', 'modifiedAt']
          }
        }
      }
    },
    responses: {
      200: {
        description: 'The updated product fields',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                productName: { type: 'string', maxLength: 20 },
                description: { type: 'string', maxLength: 300 },
                price: { type: 'integer', nullable: true },
                modifiedBy: { type: 'string' },
                modifiedAt: { type: 'string', format: 'date-time' }
              },
              required: ['id', 'productName', 'description', 'modifiedBy', 'modifiedAt']
            }
          }
        }
      },
      400: { description: 'Product already exists, or was changed/removed by another user' },
      401: { description: 'Unauthorized' }
    }
  }
})

export default eventHandler(async (event) => {

  const { id } = await useValidatedParams(event, {
    id: zh.intAsString
  })

  const { productName, description, price, modifiedAt } = await useValidatedBody(event, {
    productName: z.string().trim().min(1).max(20)
    , description: z.string().trim().min(1).max(300)
    , price: z.union([z.literal("").transform(() => null), z.number().positive()]).nullable()
    , modifiedAt: z.coerce.date().nullable()
  })

  const { user } = await requireUserSession(event)

  const t = getServerTranslation(event)

  const modifiedProduct = {
    id: +id
    , productName
    , description
    , price
    , modifiedBy: user.username
    , modifiedAt: new Date()
  }

  const env = useRuntimeEnv(event)

  // Update product
  const updatedProductIds: { updatedId: number }[] = await useDB(env).update(tables.products)
    .set(modifiedProduct).where(and(
      eq(tables.products.id, +id),
      (!modifiedAt ? isNull(tables.products.modifiedAt) : eq(tables.products.modifiedAt, modifiedAt))
    )).returning({ updatedId: tables.products.id }).catch(() => {
      throw createError({
        statusCode: 400,
        message: t('server.api.products.patch.product_already_exists', { productName: productName })
      })
    })

  const countUpdates = updatedProductIds.length

  if (countUpdates === 0) {
    throw createError({
      statusCode: 400,
      // Product is changed or removed by another user.
      message: t('server.api.products.patch.product_update_failed', { productName: productName })
    })
  }

  return modifiedProduct
})
