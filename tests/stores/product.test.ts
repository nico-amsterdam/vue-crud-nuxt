import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductStore } from '@/stores/product'
import { mande } from 'mande'
import type { MandeResponse } from 'mande'
import type { MockInstance } from 'jest-mock'
import { PRODUCT_PAGE_SIZE } from '#shared/utils/products'

type MockMandeResponseType = MandeResponse & MockInstance

// Mock mande module - create a consistent API instance
const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn()
}

vi.mock('mande', () => ({
  mande: vi.fn(() => mockApi)
}))

describe('Product Store', () => {
  const mockProduct = {
    id: 1,
    productName: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    modifiedAt: new Date()
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      // Use the test store instead of the actual store
      const store = useProductStore()

      // Set up initial state
      store.productList = [mockProduct]
      store.writing = false
      store.lastWriteErrorMsg = ''

      // Call the actual deleteProduct method
      await store.deleteProduct(mockProduct)

      // Verify the optimistic update worked
      expect(store.productList).toHaveLength(0)
      expect(store.lastWriteErrorMsg).toBe('')
      expect(store.writing).toBe(false)
    })

    it('should handle API error and revert optimistic update', async () => {
      const store = useProductStore()
      const api = mande('/api/products')

      // Set up initial state
      store.productList = [mockProduct]
      store.writing = false
      store.lastWriteErrorMsg = ''

      // Mock API error
      const apiDelete = api.delete as unknown as MockMandeResponseType
      apiDelete.mockRejectedValueOnce(new Error('Network error') as never)

      // Call the actual deleteProduct method
      await store.deleteProduct(mockProduct)

      // Verify optimistic delete was reverted
      expect(store.productList).toHaveLength(1)
      expect(store.productList[0]).toEqual(mockProduct)
      expect(store.lastWriteErrorMsg).toContain('Network error')
      expect(store.writing).toBe(false)
    })

    it('should not delete when system is busy', async () => {
      const store = useProductStore()

      // Set up initial state with system busy
      store.productList = [mockProduct]
      store.writing = true
      store.lastWriteErrorMsg = ''

      // Call the actual deleteProduct method
      await store.deleteProduct(mockProduct)

      // Verify product was not deleted
      expect(store.productList).toHaveLength(1)
      expect(store.lastWriteErrorMsg).toContain('ystem')
      expect(store.writing).toBe(true)
    })

    it('should handle product not found', async () => {
      const store = useProductStore()

      // Set up initial state with empty list
      store.productList = []
      store.writing = false
      store.lastWriteErrorMsg = ''

      // Call the actual deleteProduct method
      await store.deleteProduct(mockProduct)

      // Verify no changes were made
      expect(store.productList).toHaveLength(0)
      expect(store.lastWriteErrorMsg).toBe('')
      expect(store.writing).toBe(false)
    })
  })

  describe('addProduct', () => {
    it('should add product successfully', async () => {
      const store = useProductStore()
      const api = mande('/api/products')
      const newProduct = {
        id: null,
        productName: 'New Product',
        description: 'New Description',
        price: 49.99,
        modifiedAt: new Date()
      }
      const savedProduct = { ...newProduct, id: 2 }

      // Mock successful API call
      const apiPost = api.post as unknown as MockMandeResponseType
      apiPost.mockResolvedValueOnce(savedProduct as never)

      // Call the actual addProduct method
      await store.addProduct(newProduct)

      // Verify the product was added with the new ID
      expect(store.productList).toHaveLength(1)
      expect(store.productList[0]).toEqual(savedProduct)
      expect(store.lastWriteErrorMsg).toBe('')
      expect(store.writing).toBe(false)
    })

    it('should handle API error when adding product', async () => {
      const store = useProductStore()
      const api = mande('/api/products')
      const newProduct = {
        id: null,
        productName: 'New Product',
        description: 'New Description',
        price: 49.99,
        modifiedAt: new Date()
      }

      // Mock API error
      const apiPost = api.post as unknown as MockMandeResponseType
      apiPost.mockRejectedValueOnce(new Error('Network error') as never)

      // Call the actual addProduct method
      await store.addProduct(newProduct)

      // Verify optimistic add was reverted
      expect(store.productList).toHaveLength(0)
      expect(store.lastWriteErrorMsg).toContain('Network error')
      expect(store.writing).toBe(false)
    })
  })

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      const store = useProductStore()
      const api = mande('/api/products')
      const updatedProduct = {
        ...mockProduct,
        productName: 'Updated Product'
      }

      // Set up initial state
      store.productList = [mockProduct]
      store.writing = false
      store.lastWriteErrorMsg = ''

      // Mock successful API call
      const apiPatch = api.patch as unknown as MockMandeResponseType
      apiPatch.mockResolvedValueOnce(updatedProduct as never)

      // Call the actual updateProduct method
      await store.updateProduct(updatedProduct)

      // Verify the product was updated
      expect(store.productList).toHaveLength(1)
      expect(store.productList[0]).toEqual(updatedProduct)
      expect(store.lastWriteErrorMsg).toBe('')
      expect(store.writing).toBe(false)
    })

    it('should handle API error when updating product', async () => {
      const store = useProductStore()
      const api = mande('/api/products')
      const updatedProduct = {
        ...mockProduct,
        productName: 'Updated Product'
      }

      // Set up initial state
      store.productList = [mockProduct]
      store.writing = false
      store.lastWriteErrorMsg = ''

      // Mock API error
      const apiPatch = api.patch as unknown as MockMandeResponseType
      apiPatch.mockRejectedValueOnce(new Error('Network error') as never)

      // Call the actual updateProduct method
      await store.updateProduct(updatedProduct)

      // Verify optimistic update was reverted
      expect(store.productList).toHaveLength(1)
      expect(store.productList[0]).toEqual(mockProduct) // Should be reverted
      expect(store.lastWriteErrorMsg).toContain('Network error')
      expect(store.writing).toBe(false)
    })
  })

  describe('fetchProducts', () => {
    it('should fetch products successfully', async () => {
      const store = useProductStore()
      const api = mande('/api/products')
      const mockProducts = [
        mockProduct,
        { ...mockProduct, id: 2, productName: 'Product 2' }
      ]

      // Set up initial state
      store.productList = []
      store.reading = false
      store.lastReadErrorMsg = ''

      // Mock successful API call
      const apiGet = api.get as unknown as MockMandeResponseType
      apiGet.mockResolvedValueOnce(mockProducts as never)

      // Call the actual fetchProducts method
      await store.fetchProducts()

      // Verify products were fetched
      expect(store.productList).toEqual(mockProducts)
      expect(store.lastReadErrorMsg).toBe('')
      expect(store.reading).toBe(false)
    })

    it('should handle API error when fetching products', async () => {
      const store = useProductStore()
      const api = mande('/api/products')

      // Set up initial state
      store.productList = []
      store.reading = false
      store.lastReadErrorMsg = ''

      // Mock API error
      const apiGet = api.get as unknown as MockMandeResponseType
      apiGet.mockRejectedValueOnce(new Error('Network error') as never)

      // Call the actual fetchProducts method
      await store.fetchProducts()

      // Verify no products were added and error message was set
      expect(store.productList).toEqual([])
      expect(store.lastReadErrorMsg).toContain('Network error')
      expect(store.reading).toBe(false)
    })
  })

  describe('fetchProducts with many rows', () => {
    it('should switch to server-side search and keep only one page of rows', async () => {
      const store = useProductStore()
      const api = mande('/api/products')
      const mockProducts = Array.from({ length: PRODUCT_PAGE_SIZE + 1 }, (_, i) => ({
        ...mockProduct,
        id: i + 1,
        productName: 'Product ' + String(i + 1).padStart(3, '0')
      }))

      // Mock successful API call with more rows than the page size
      const apiGet = api.get as unknown as MockMandeResponseType
      apiGet.mockResolvedValueOnce(mockProducts as never)

      await store.fetchProducts()

      expect(store.serverSearch).toBe(true)
      expect(store.hasMore).toBe(true)
      expect(store.productList).toHaveLength(PRODUCT_PAGE_SIZE)
      expect(store.lastReadErrorMsg).toBe('')
      expect(store.reading).toBe(false)
    })

    it('should filter in the client when all rows fit on one page', async () => {
      const store = useProductStore()
      const api = mande('/api/products')
      const mockProducts = [mockProduct, { ...mockProduct, id: 2, productName: 'Product 2' }]

      const apiGet = api.get as unknown as MockMandeResponseType
      apiGet.mockResolvedValueOnce(mockProducts as never)

      await store.fetchProducts()

      expect(store.serverSearch).toBe(false)
      expect(store.hasMore).toBe(false)
      expect(store.productList).toEqual(mockProducts)
    })
  })

  describe('server-side search with findbyname', () => {
    it('should search by name on the server and replace the list', async () => {
      const store = useProductStore()
      const api = mande('/api/products')

      const apiGet = api.get as unknown as MockMandeResponseType
      apiGet.mockResolvedValueOnce([mockProduct] as never)

      await store.searchProductsByName('Test')

      expect(apiGet).toHaveBeenCalledWith('/findbyname', expect.objectContaining({
        query: expect.objectContaining({ search: 'Test', from: '' })
      }))
      expect(store.searchKey).toBe('Test')
      expect(store.productList).toEqual([mockProduct])
      expect(store.lastReadErrorMsg).toBe('')
    })

    it('should detect more rows when the search returns a full page plus one', async () => {
      const store = useProductStore()
      const api = mande('/api/products')
      const mockProducts = Array.from({ length: PRODUCT_PAGE_SIZE + 1 }, (_, i) => ({
        ...mockProduct,
        id: i + 1,
        productName: 'Product ' + String(i + 1).padStart(3, '0')
      }))

      const apiGet = api.get as unknown as MockMandeResponseType
      apiGet.mockResolvedValueOnce(mockProducts as never)

      await store.searchProductsByName('Product')

      expect(store.hasMore).toBe(true)
      expect(store.productList).toHaveLength(PRODUCT_PAGE_SIZE)
    })
  })

  describe('loadMoreProducts', () => {
    it('should append the next page using the last product name', async () => {
      const store = useProductStore()
      const api = mande('/api/products')
      const firstPage = [mockProduct, { ...mockProduct, id: 2, productName: 'Product 2' }]
      const nextPage = [{ ...mockProduct, id: 3, productName: 'Product 3' }]

      // Set up initial state: one page loaded with more rows available
      store.productList = firstPage
      store.hasMore = true
      store.searchKey = 'Product'

      const apiGet = api.get as unknown as MockMandeResponseType
      apiGet.mockResolvedValueOnce(nextPage as never)

      const loaded = await store.loadMoreProducts()

      expect(loaded).toBe(true)
      expect(apiGet).toHaveBeenCalledWith('/findbyname', expect.objectContaining({
        query: expect.objectContaining({ search: 'Product', from: 'Product 2' })
      }))
      expect(store.productList).toEqual([...firstPage, ...nextPage])
      expect(store.lastReadErrorMsg).toBe('')
    })

    it('should do nothing when there are no more rows', async () => {
      const store = useProductStore()
      const api = mande('/api/products')

      store.hasMore = false
      const apiGet = api.get as unknown as MockMandeResponseType

      const loaded = await store.loadMoreProducts()

      expect(loaded).toBe(false)
      expect(apiGet).not.toHaveBeenCalled()
      expect(store.productList).toEqual([])
    })
  })

  describe('store state', () => {
    it('should initialize with correct default values', () => {
      const store = useProductStore()

      expect(store.productList).toEqual([])
      expect(store.writing).toBe(false)
      expect(store.reading).toBe(false)
      expect(store.lastWriteErrorMsg).toBe('')
      expect(store.lastReadErrorMsg).toBe('')
      expect(store.searchKey).toBe('')
      expect(store.hasMore).toBe(false)
      expect(store.serverSearch).toBe(false)
    })
  })
})