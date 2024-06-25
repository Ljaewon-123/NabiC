import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSelectedFileStore = defineStore('selectedFile', () => {
  const allFileChecks = ref<boolean[]>([])


  return {
    allFileChecks
  }
})
