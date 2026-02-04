import { useValidatedParams, useValidatedBody, z, zh } from 'h3-zod'

export default eventHandler(async (event) => {

  const { id } = await useValidatedParams(event, {
    id: zh.intAsString
  })

  const { productName, description, price } = await useValidatedBody(event, {
    productName: z.string().trim().min(1).max(20)
    , description: z.string().trim().min(1).max(300)
    , price: z.union([z.literal("").transform(() => null), z.number().positive()]).nullable()
    // To prevent overwriting somebody else's update, compare modifiedAt in the where-clause of the update
    // modifiedAt: z.string().nullable()
  })

  const { user } = await requireUserSession(event)

  const modifiedProduct = {
    productName
    , description
    , price
    , modifiedBy: user.username
    , modifiedAt: new Date()
  }

  const env = event.context.cloudflare.env as unknown as Env

  // Update product
  const product = await useDB(env).update(tables.products)
    .set(modifiedProduct).where(and(
      eq(tables.products.id, id)
    )).returning().get()

  const t = getServerTranslation(event)

  if (!product) {
    throw createError({
      statusCode: 400,
      message: t('server.api.products.patch.product_update_failed', {productName: productName})
    })
  }

  return product
})
