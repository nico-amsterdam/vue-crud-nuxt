export default eventHandler(async (event) => {
  await requireUserSession(event)

  const env = event.context.cloudflare.env as unknown as Env

  // List all products
  const products = await useDB(env).select().from(tables.products).orderBy(asc(tables.products.productName)).all()

  return products
})
