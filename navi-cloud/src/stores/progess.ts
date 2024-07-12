import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

interface DownloadData{
  id:number
  fileName: string
  file: { data: Buffer, type: "Buffer" }
  fileType: string
}
interface DownloadErrorType{
  id?: number
  fileName: 'download error'
  fileType: "error/error"
}

export const useProgressStore = defineStore('progress', () => {
  
  const progressModal = ref(false)
  const downloadSuccess = ref(false)
  const downloadError = ref(false)
  const downloadLoading = ref(false)
  const downloadPercent = ref(0)

  const downloadItems = ref<(DownloadData | DownloadErrorType)[]>([])

  const getDownloadItems = (item: DownloadData | DownloadErrorType ) => {
    downloadItems.value.push(item)
  }

  const startPromise = () => {
    progressModal.value = true
    downloadSuccess.value = false
  }
  const loadPromise = () => {
    downloadLoading.value = true
  }

  return { 
    getDownloadItems,
    progressModal,
    downloadSuccess,
    downloadError,
    downloadLoading,
    downloadItems,
  }
})
