import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import axios, { AxiosError } from "axios";
import { AxiosAPI } from ".";

const API_URL = import.meta.env.VITE_APP_URL
const { setAccessToken, getAccessToken } = useAuthStore()

class AxiosRefresh {
  create(baseURL: string, options?: any) {

    const instance = axios.create(Object.assign({ baseURL }, options));
  
    // instance.defaults.withCredentials = true;
    
    instance.interceptors.request.use(
      config => {
  
        config.headers['Authorization'] = "Bearer " + `${getAccessToken()}`
  
        return config
      }
    )
  
    instance.interceptors.response.use(
      response => {
        return response
      },
      async (error) => {
  
        console.log('최종 반환')
        // 인증 최종 return 
        localStorage.clear()
        router.push({ name: 'Login' })
  
        return error
      }, { synchronous: true }
    )
    
    return instance
  }
  
  
}

const axiosUpload = new AxiosRefresh()
export const refresh = axiosUpload.create(API_URL)
