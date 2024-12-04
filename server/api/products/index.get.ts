import { asc } from 'drizzle-orm'

export default eventHandler(async (event) => {
  await requireUserSession(event)

  // List all products
  const products = await useDB().select().from(tables.products).orderBy(asc(tables.products.productName)).all()

  return products
})
