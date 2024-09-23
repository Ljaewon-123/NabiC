import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import axios, { AxiosError } from "axios";
import { AxiosAPI } from ".";

const API_URL = import.meta.env.VITE_APP_URL
const { setAccessToken, getAccessToken, getRefreshToken } = useAuthStore()

class AxiosRefresh {
  create(baseURL: string, options?: any) {

    const instance = axios.create(Object.assign({ baseURL }, options));
  
    // instance.defaults.withCredentials = true;
    
    instance.interceptors.request.use(
      config => {
  
        config.headers['Authorization'] = "Bearer " + `${getRefreshToken()}`
  
        return config
      }
    )
  
    instance.interceptors.response.use(
      response => {
        return response
      },
      async (error) => {
  
        console.log('최종 반환', error)
        // 인증 최종 return 

        // 모든 종류의 인증이 만료된거라 이런형식은 못씀
        // await instance.post('auth/logout',{})
        
        localStorage.clear()
        router.push({ name: 'Login' })
        // 새로고침
        router.go(0)
  
        return error
      }, { synchronous: true }
    )
    
    return instance
  }
  
  
}

const axiosUpload = new AxiosRefresh()
export const refresh = axiosUpload.create(API_URL)
