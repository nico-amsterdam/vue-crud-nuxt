import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useMediaQuery } from '@vueuse/core'

/*
 * Pinia store
 */

export const useThemeStore = defineStore('themeStore', () => {

  const isPreferredDark = useMediaQuery('(prefers-color-scheme: dark)')
  const darkmode = ref(isPreferredDark.value)

  function toggleDark() {
    darkmode.value = !darkmode.value
  }

  return {
    darkmode, toggleDark
  }
})
