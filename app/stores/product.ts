import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'
import { mande } from 'mande'

const api = mande('/api/products')

type ProductBaseType = {
  productName: string;
  description: string;
  price: number | null;
}

type ProductType = {id: number} & ProductBaseType
type AddProductType = {id: number | null} & ProductBaseType

function convertErrorToMessage(error: any): string {
  let errorMessage = 'An unknown error occurred'
  if (error instanceof Error) {
    errorMessage = error.message
  } else {
    errorMessage = String(error)
  }
  if (errorMessage === 'Failed to fetch') errorMessage = 'Connection failed. Network offline?'
  return errorMessage
}

export const useProductStore = defineStore('productStore', () => {

  const productList = ref<ProductType[]>([])
  const loading = ref(false)
  const lastErrorMessage = ref('')
  let   uniqueId = -1;

  async function fetchProducts() {
    // I did not provide the full url in the .env, which is needed to do api calls during SSR
    if (process.server) return; // during SSR, no api calls. Wait for client-side rending
    loading.value = true
    try {
      productList.value = await api.get<ProductType[]>()
    } catch (error) {
      console.log('Get error: ' + error)
      lastErrorMessage.value = convertErrorToMessage(error)
    } finally {
      loading.value = false
    }
  }

  function revertOptimisticAdd(product: AddProductType) {
      // revert optimistic update
      const popProduct = productList.value.pop()
      // but not if the list was fetched again. Check if the reverted product was the added product.
      if (popProduct && popProduct.productName !== product.productName) productList.value.push(popProduct)
  }

  async function addProduct(product: AddProductType) {
    if (process.server) return; // during SSR, no api calls. Wait for client-side rendering
    loading.value = true
    try {
       // optimistic update
      productList.value.push({...product, id: uniqueId--})
      const newProduct = await api.post<ProductType>(product)
      lastErrorMessage.value = ''
      revertOptimisticAdd(product)
      productList.value.push(newProduct) // new product with the new id
    } catch (error) {
      revertOptimisticAdd(product)
      console.log('Post error: ' + error)
      lastErrorMessage.value = convertErrorToMessage(error)
    } finally {
      loading.value = false
    }
  }

  function getProductIndex(product: ProductType): number {
    return productList.value.findIndex(p => p.id === product.id)
  }

  async function updateProduct(product: ProductType) {
    if (process.server) return; // during SSR, no api calls. Wait for client-side rendering
    loading.value = true

    let productIndex = getProductIndex(product)
    if (productIndex === -1) return; // cannot change deleted product
    const oldProduct = productList.value[productIndex] as ProductType
    try {
      productList.value.splice(productIndex, 1, product) // optimistic change
      const changedProduct = await api.patch<ProductType>(product.id, product)
      lastErrorMessage.value = ''
      // lookup index again, situation may have changed while waiting.
      productIndex = getProductIndex(product)
      if (productIndex !== -1) productList.value.splice(productIndex, 1, changedProduct)
    } catch (error) {
      // lookup index again, situation may have changed while waiting.
      productIndex = getProductIndex(product)
      if (productIndex !== -1) productList.value.splice(productIndex, 1, oldProduct) // revert optimistic change
      console.log('Patch error: ' + error)
      lastErrorMessage.value = convertErrorToMessage(error)
    } finally {
      loading.value = false
    }
  }

  async function deleteProduct(product: ProductType) {
    if (process.server) return; // during SSR, no api calls. Wait for client-side rendering
    console.log('delete ' + product.productName)
    loading.value = true
    const productIndex = getProductIndex(product)
    if (productIndex === -1) return; // cannot delete deleted product
    try {
      productList.value.splice(productIndex, 1) // optimistic delete
      await api.delete<ProductType>(product.id)
      lastErrorMessage.value = ''
    } catch (error) {
      productList.value.splice(productIndex, 0, product) // revert optimistic delete
      lastErrorMessage.value = convertErrorToMessage(error)
      console.log('Delete error: ' + lastErrorMessage.value)
    } finally {
      loading.value = false
    }
  }

  return { addProduct, updateProduct, deleteProduct, productList, fetchProducts, loading, lastErrorMessage }
})
