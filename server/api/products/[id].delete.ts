import { useValidatedParams, zh } from 'h3-zod'

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
