import { eq, and } from 'drizzle-orm'
import { useValidatedParams, useValidatedBody, z, zh } from 'h3-zod'

export default eventHandler(async (event) => {

  const { id } = await useValidatedParams(event, {
    id: zh.intAsString
  })

  const { productName, description, price } = await useValidatedBody(event, {
    productName: z.string().min(1).max(20),
    description: z.string().min(1).max(300),
    price: z.number().positive()
  })

  const { user } = await requireUserSession(event)

  const modifiedProduct = {
    productName
  , description
  , price
  , modifiedBy: user.username
  , modifiedAt: new Date()
  }

  // Update product
  const product = await useDB().update(tables.products)
  .set(modifiedProduct).where(and(
    eq(tables.products.id, id)
  )).returning().get()

  return product
})
