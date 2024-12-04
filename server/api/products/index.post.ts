import { useValidatedBody, z } from 'h3-zod'

export default eventHandler(async (event) => {

  const { productName, description, price } = await useValidatedBody(event, {
    productName: z.string().min(1).max(20),
    description: z.string().min(1).max(300),
    price: z.union([z.literal("").transform(() => null), z.number().positive()]).nullable()
  })

  const { user } = await requireUserSession(event)

  const newProduct = {
    productName
  , description
  , price
  , createdBy: user.username
  }

  // Insert product
  const product = await useDB().insert(tables.products).values(newProduct).returning().get()

  // TODO: return the sql errors instead of 'internal server error'. For example for unique constraint error.

  return product
})
