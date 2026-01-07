import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductStore } from '@/stores/product'
import { mande } from 'mande'

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
    price: 99.99
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
      api.delete.mockRejectedValueOnce(new Error('Network error'))

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
      const api = mande('/api/products')

      // Set up initial state with system busy
      store.productList = [mockProduct]
      store.writing = true
      store.lastWriteErrorMsg = ''

      // Call the actual deleteProduct method
      await store.deleteProduct(mockProduct)

      // Verify product was not deleted
      expect(store.productList).toHaveLength(1)
      expect(store.lastWriteErrorMsg).toBe(`System is busy. Cannot delete '${mockProduct.productName}'`)
      expect(store.writing).toBe(true)
    })

    it('should handle product not found', async () => {
      const store = useProductStore()
      const api = mande('/api/products')

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
        price: 49.99
      }
      const savedProduct = { ...newProduct, id: 2 }

      // Mock successful API call
      api.post.mockResolvedValueOnce(savedProduct)

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
        price: 49.99
      }

      // Mock API error
      api.post.mockRejectedValueOnce(new Error('Network error'))

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
      api.patch.mockResolvedValueOnce(updatedProduct)

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
      api.patch.mockRejectedValueOnce(new Error('Network error'))

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
      api.get.mockResolvedValueOnce(mockProducts)

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
      api.get.mockRejectedValueOnce(new Error('Network error'))

      // Call the actual fetchProducts method
      await store.fetchProducts()

      // Verify no products were added and error message was set
      expect(store.productList).toEqual([])
      expect(store.lastReadErrorMsg).toContain('Network error')
      expect(store.reading).toBe(false)
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
    })
  })
})