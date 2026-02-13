import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mande } from 'mande'
import type { MandeError } from 'mande'

/*
 * Types
 */

type ProductBaseType = {
  productName: string;
  description: string;
  price: number | null;
}

type ProductType = { id: number } & ProductBaseType
type AddProductType = { id: number | null } & ProductBaseType

/*
 * Pinia store
 */

export const useProductStore = defineStore('productStore', () => {

  const api = mande('/api/products')
  const productList = ref<ProductType[]>([])
  const writing = ref(false)
  const reading = ref(false)
  const lastWriteErrorMsg = ref('')
  const lastReadErrorMsg = ref('')
  let uniqueId = -1
  let deferFetch = false

  function t(key: string, params?: Record<string, unknown>): string {
    if (import.meta.client) {
      // Client-side: useI18n
      const t2 = useNuxtApp().$i18n.t
      return params ? t2(key, params) : t2(key)
    }
    // during tests is i18n not avaible.
    return key
  }

  function getLocale() {
    if (import.meta.client) {
      return useNuxtApp().$i18n.locale.value
    }
    // during tests return 'en'
    return 'en'
  }

  function convertErrorToMessage(error: any, failedToFetchMsg: string): string {
    let errorMessage = 'An unknown error occurred'
    if ('body' in error) {
      let mandeErrorBody = (error as MandeError).body
      // body.data may contain a ZodError
      errorMessage = mandeErrorBody?.data?.issues[0]?.message || mandeErrorBody?.message || error.message
    } else if (error instanceof Error) {
      errorMessage = error.message
    } else {
      errorMessage = String(error)
    }
    if (errorMessage === 'Failed to fetch') errorMessage = failedToFetchMsg
    return errorMessage
  }

  async function fetchProducts() {
    // I did not provide the full url in the .env, which is needed to do api calls during SSR
    if (import.meta.server) return; // during SSR, no api calls. Wait for client-side rending
    if (reading.value) return;
    // do not interfere with the optimistic write actions. They changed the product list, keep it unchanged.
    if (writing.value) {
      deferFetch = true;
      return;
    }
    reading.value = true
    deferFetch = false
    lastReadErrorMsg.value = ''
    try {
      let newProductList = await api.get<ProductType[]>({ query: { 'lang': getLocale() } })
      if (writing.value) {
        // again, do not change the list if there are optimistic changes in it
        deferFetch = true
      } else {
        productList.value = newProductList
      }
    } catch (error) {
      console.log('Get error: ' + JSON.stringify(error, null, 2))
      lastReadErrorMsg.value = convertErrorToMessage(error, t('stores.product.cannot_refresh_list'))
    } finally {
      reading.value = false
    }
  }

  function revertOptimisticAdd(product: AddProductType) {
    // revert optimistic update
    const popProduct = productList.value.pop()
    // To be sure, check if the reverted product was the added product.
    if (popProduct && popProduct.productName !== product.productName) productList.value.push(popProduct)
  }

  async function addProduct(product: AddProductType) {
    if (import.meta.server) return; // during SSR, no api calls. Wait for client-side rendering
    if (writing.value) {
      // user has to wait until previous write action is ready
      lastWriteErrorMsg.value = t('stores.product.system_busy_create', { productName: product.productName })
      return
    }
    writing.value = true
    lastWriteErrorMsg.value = ''
    // optimistic update
    productList.value.push({ ...product, id: uniqueId-- })
    try {
      const newProduct = await api.post<ProductType>(product, { query: { 'lang': getLocale() } })
      revertOptimisticAdd(product)
      productList.value.push(newProduct) // new product with the new id
    } catch (error) {
      revertOptimisticAdd(product)
      console.log('Post error: ' + JSON.stringify(error, null, 2))
      lastWriteErrorMsg.value = convertErrorToMessage(error, t('stores.product.cannot_create', { productName: product.productName }))
    } finally {
      writing.value = false
    }
    if (deferFetch) fetchProducts()
  }

  function getProductIndexById(product: ProductType): number {
    return productList.value.findIndex(p => p.id === product.id)
  }

  async function updateProduct(product: ProductType) {
    if (import.meta.server) return; // during SSR, no api calls. Wait for client-side rendering
    if (writing.value) {
      // user has to wait until previous write action is ready
      lastWriteErrorMsg.value = t('stores.product.system_busy_update', { productName: product.productName })
      return
    }
    writing.value = true
    lastWriteErrorMsg.value = ''
    const productIndex = getProductIndexById(product)
    if (productIndex === -1) {
      writing.value = false
      return; // cannot change deleted product
    }
    const oldProduct = productList.value[productIndex] as ProductType
    productList.value.splice(productIndex, 1, product) // optimistic change
    try {
      const changedProduct = await api.patch<ProductType>(product.id, product, { query: { 'lang': getLocale() } })
      productList.value.splice(productIndex, 1, changedProduct)
    } catch (error) {
      productList.value.splice(productIndex, 1, oldProduct) // revert optimistic change
      console.log('Patch error: ' + JSON.stringify(error, null, 2))
      lastWriteErrorMsg.value = convertErrorToMessage(error, t('stores.product.cannot_update', { productName: product.productName }))
    } finally {
      writing.value = false
    }
    if (deferFetch) fetchProducts()
  }

  async function deleteProduct(product: ProductType) {
    if (import.meta.server) return; // during SSR, no api calls. Wait for client-side rendering
    if (writing.value) {
      // user has to wait until previous write action is ready
      lastWriteErrorMsg.value = t('stores.product.system_busy_delete', { productName: product.productName })
      return
    }
    writing.value = true
    lastWriteErrorMsg.value = ''
    const productIndex = getProductIndexById(product)
    if (productIndex === -1) {
      writing.value = false
      return; // cannot delete deleted product
    }
    productList.value.splice(productIndex, 1) // optimistic delete
    try {
      await api.delete<ProductType>(product.id, { query: { 'lang': getLocale() } })
    } catch (error) {
      productList.value.splice(productIndex, 0, product) // revert optimistic delete
      console.log('Delete error: ' + JSON.stringify(error, null, 2))
      lastWriteErrorMsg.value = convertErrorToMessage(error, t('stores.product.cannot_delete', { productName: product.productName }))
    } finally {
      writing.value = false
    }
    if (deferFetch) fetchProducts()
  }

  return {
    addProduct, updateProduct, deleteProduct, fetchProducts
    , productList, reading, writing, lastReadErrorMsg, lastWriteErrorMsg
  }
})
