import { defineRouteMeta } from 'nitro'
import { useValidatedBody, z } from 'h3-zod'

defineRouteMeta({
  openAPI: {
    tags: ['products'],
    summary: 'Create a product',
    description: 'Creates a new product owned by the authenticated user. Requires an authenticated session.',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              productName: { type: 'string', minLength: 1, maxLength: 20 },
              description: { type: 'string', minLength: 1, maxLength: 300 },
              price: { type: 'number', exclusiveMinimum: 0, nullable: true }
            },
            required: ['productName', 'description']
          }
        }
      }
    },
    responses: {
      200: {
        description: 'The created product',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Product' }
          }
        }
      },
      400: { description: 'Product already exists or creation failed' },
      401: { description: 'Unauthorized' }
    }
  }
})

export default eventHandler(async (event) => {

  const { productName, description, price } = await useValidatedBody(event, {
    productName: z.string().trim().min(1).max(20),
    description: z.string().trim().min(1).max(300),
    price: z.union([z.literal("").transform(() => null), z.number().positive()]).nullable()
  })

  const { user } = await requireUserSession(event)

  const t = getServerTranslation(event)

  const newProduct = {
    productName
    , description
    , price
    , createdBy: user.username
  }

  const env = useRuntimeEnv(event)

  // Insert product
  const product = await useDB(env).insert(tables.products).values(newProduct).returning().get().catch(() => {
    throw createError({
      statusCode: 400,
      message: t('server.api.products.post.product_already_exists', {productName: productName})
    })
  })

  if (!product) {
    throw createError({
      statusCode: 400,
      message: t('server.api.products.post.product_create_failed', {productName: productName})
    })
  }

  return product
})
