import { defineStore } from 'pinia'
import { ref } from 'vue'

/*
 * Pinia store
 */

export const useThemeStore = defineStore('themeStore', () => {

  const darkmode = ref(false)

  function toggleDark() {
    darkmode.value = !darkmode.value
  }

  return {
    darkmode, toggleDark
  }
})
