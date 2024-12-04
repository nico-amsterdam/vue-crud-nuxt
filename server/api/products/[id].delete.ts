import { eq } from 'drizzle-orm'
import { useValidatedParams, zh } from 'h3-zod'

export default eventHandler(async (event) => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString
  })
  await requireUserSession(event)

  // Delete product
  const deletedProduct = await useDB().delete(tables.products).where(
    eq(tables.products.id, id)
  ).returning().get()

  if (!deletedProduct) {
    throw createError({
      statusCode: 404,
      message: 'Product not found'
    })
  }
  return deletedProduct
})
