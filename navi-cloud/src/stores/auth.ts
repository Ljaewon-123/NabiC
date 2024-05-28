import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  
  const setAccessToken = (token: string) => localStorage.setItem('vtoken', token)
  const getAccessToken = () => localStorage.getItem('vtoken')

  return { 
    setAccessToken,
    getAccessToken
  }
})
