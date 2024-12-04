import { useValidatedBody, z } from 'h3-zod'

export default eventHandler(async (event) => {

  const { productName, description, price } = await useValidatedBody(event, {
    productName: z.string().min(1).max(20),
    description: z.string().min(1).max(300),
    price: z.number().positive()
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

  // TODO: handling errors, like the unique constraint error

  return product
})
