import { useValidatedParams, useValidatedBody, z, zh } from 'h3-zod'

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

  const env = event.context.cloudflare.env as unknown as Env

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
