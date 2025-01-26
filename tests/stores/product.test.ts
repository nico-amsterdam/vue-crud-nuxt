import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductStore } from '@/stores/product'
import { mande } from 'mande'

// Mock mande module
vi.mock('mande', () => ({
  mande: vi.fn(() => ({
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  }))
}))

describe('Product Store', () => {
  const mockProduct = {
    id: 1,
    productName: 'Test Product',
    description: 'Test Description',
    price: 99.99
  }

  beforeEach(() => {
    // Create a fresh Pinia instance and make it active
    setActivePinia(createPinia())
    // Reset all mocks before each test
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetModules()
  })

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      const store = useProductStore()
      const api = mande('/api/products')

      // Add initial product to the store
      store.productList = [mockProduct]
      api.delete.mockResolvedValueOnce({})

      await store.deleteProduct(mockProduct)

      expect(store.productList).toHaveLength(0)
      expect(store.lastWriteErrorMsg).toBe('')
      expect(store.writing).toBe(false)
    })

  })
})
