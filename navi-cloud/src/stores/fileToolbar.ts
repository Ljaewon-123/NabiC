import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useFileToolbarStore = defineStore('fileToolbar', () => {
  const allFileChecks = ref<boolean[]>([])


  return {
    allFileChecks
  }
})
