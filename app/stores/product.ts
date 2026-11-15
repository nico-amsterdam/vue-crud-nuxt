import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mande } from 'mande'
import type { MandeError } from 'mande'
import { PRODUCT_PAGE_SIZE } from '#shared/utils/products'

/*
 * Types
 */

type ProductBaseType = {
  productName: string;
  description: string;
  price: number | null;
  modifiedAt: Date | null;
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
  // Current search phrase. With many rows it is passed to the server,
  // with few rows it is used for filtering in the client.
  const searchKey = ref('')
  // True when the last fetch returned more rows than the page size,
  // so more rows can be loaded while scrolling down.
  const hasMore = ref(false)
  const loadingMore = ref(false)
  // Filter strategy: with many rows the server filters with findbyname,
  // with few rows all rows are loaded and filtered in the client.
  const serverSearch = ref(false)
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
        // One extra row is fetched: if it exists, there are more rows.
        // Do not display the extra row, it is loaded again with the next page.
        hasMore.value = newProductList.length > PRODUCT_PAGE_SIZE
        serverSearch.value = hasMore.value
        productList.value = hasMore.value ? newProductList.slice(0, PRODUCT_PAGE_SIZE) : newProductList
      }
    } catch (error) {
      console.log('Get error: ' + JSON.stringify(error, null, 2))
      lastReadErrorMsg.value = convertErrorToMessage(error, t('stores.product.cannot_refresh_list'))
    } finally {
      reading.value = false
    }
    if (serverSearch.value && searchKey.value !== '') {
      // the client-side filter is not used with many rows, search on the server
      await searchProductsByName(searchKey.value)
    }
  }

  // Search by product name on the server. Used when the table has many rows.
  async function searchProductsByName(search: string): Promise<boolean> {
    searchKey.value = search
    return findProductsByName(search, '')
  }

  // Load the next page while scrolling down. The last product name of the
  // loaded rows is passed on to search for more results after it.
  // Returns true when a page was fetched, false when nothing was loaded.
  async function loadMoreProducts(): Promise<boolean> {
    if (!hasMore.value) return false
    const lastProduct = productList.value[productList.value.length - 1]
    if (!lastProduct || lastProduct.id < 0) return false; // last row is an optimistic change, wait for it
    return findProductsByName(searchKey.value, lastProduct.productName)
  }

  async function findProductsByName(search: string, from: string): Promise<boolean> {
    if (import.meta.server) return false; // during SSR, no api calls. Wait for client-side rending
    if (reading.value) return false;
    if (writing.value) {
      deferFetch = true;
      return false;
    }
    reading.value = true
    deferFetch = false
    lastReadErrorMsg.value = ''
    loadingMore.value = true
    try {
      const newProducts = await api.get<ProductType[]>('/findbyname', {
        query: { 'search': search, 'from': from, 'lang': getLocale() }
      })
      if (writing.value) {
        // again, do not change the list if there are optimistic changes in it
        deferFetch = true
      } else {
        // One extra row is fetched: if it exists, there are more rows.
        hasMore.value = newProducts.length > PRODUCT_PAGE_SIZE
        const pageRows = hasMore.value ? newProducts.slice(0, PRODUCT_PAGE_SIZE) : newProducts
        if (from === '') {
          productList.value = pageRows // new search replaces the loaded rows
        } else {
          productList.value = [...productList.value, ...pageRows] // scrolled down, append the next page
        }
      }
    } catch (error) {
      console.log('Get error: ' + JSON.stringify(error, null, 2))
      lastReadErrorMsg.value = convertErrorToMessage(error, t('stores.product.cannot_refresh_list'))
    } finally {
      reading.value = false
      loadingMore.value = false
    }
    return true
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

  function clearErrors() {
    if (!reading.value) lastReadErrorMsg.value = ''
    if (!writing.value) lastWriteErrorMsg.value = ''
  }

  return {
    addProduct, updateProduct, deleteProduct, fetchProducts, searchProductsByName, loadMoreProducts, clearErrors
    , productList, searchKey, hasMore, serverSearch, loadingMore, reading, writing, lastReadErrorMsg, lastWriteErrorMsg
  }
})
