import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export type Tokens = {
  access_token: string;
  refresh_token: string;
}

export const useAuthStore = defineStore('auth', () => {
  
  const setToken = (tokens: Tokens) => {
    setAccessToken(tokens.access_token)
    setRefreshToken(tokens.refresh_token)
  }
  const setAccessToken = (token: string) => localStorage.setItem('vtoken', token)
  const getAccessToken = () => localStorage.getItem('vtoken')
  const setRefreshToken = (token:string) => localStorage.setItem('vdata', token)
  const getRefreshToken = () => localStorage.getItem('vdata')

  return { 
    setAccessToken,
    getAccessToken,
    getRefreshToken,
    setToken
  }
})
