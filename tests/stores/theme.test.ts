import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useThemeStore } from '@/stores/theme'

describe('Theme Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with dark mode disabled', () => {
    const store = useThemeStore()

    expect(store.darkmode).toBe(false)
  })

  it('should toggle dark mode', () => {
    const store = useThemeStore()

    store.toggleDark()
    expect(store.darkmode).toBe(true)

    store.toggleDark()
    expect(store.darkmode).toBe(false)
  })
})
