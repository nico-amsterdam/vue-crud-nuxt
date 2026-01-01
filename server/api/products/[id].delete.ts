import { useValidatedParams, zh } from 'h3-zod'

export default eventHandler(async (event) => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString
  })
  await requireUserSession(event)

  const env = event.context.cloudflare.env as unknown as Env

  // Delete product
  const deletedProduct = await useDB(env).delete(tables.products).where(
    eq(tables.products.id, id)
  ).returning().get()

  return deletedProduct
})
