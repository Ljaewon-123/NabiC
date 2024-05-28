import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import axios, { AxiosError } from "axios";


const API_URL = import.meta.env.VITE_APP_URL

export const naviapi = create(API_URL)
export const upload = createUpload(`${API_URL}/upload`)
const refresh = refreshCreate(API_URL)

const { setAccessToken, getAccessToken } = useAuthStore()

function create(baseURL: string, options?: any) {

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

      if(error.code == 'ERR_CANCELED') return AxiosError

      console.log(error, 'errorj')
      const { config, response: { status }} = error

      if( status == 401 ){
        try{
          const response = await refresh.post('auth/refresh')
          const { access_token } = response.data
  
          console.log(response.data)
  
          setAccessToken(access_token)
        }
        catch (e: any){
          console.log(e)
        }
      }


      return error
    }, { synchronous: true }
  )
  
  return instance
}

function createUpload(baseURL: string, options?: any) {

  const instance = axios.create(Object.assign({ baseURL }, options));

  // instance.defaults.withCredentials = true;
  
  instance.interceptors.request.use(
    config => {

      config.headers['Authorization'] = "Bearer " + `${localStorage.getItem('vtoken')}`
      config.headers['Content-Type'] =  'multipart/form-data'

      return config
    }
  )

  instance.interceptors.response.use(
    response => {
      return response
    },

    async (error) => {

      if(error.code == 'ERR_CANCELED') return AxiosError

      console.log(error, 'errorj')
      const { config, response: { status }} = error

      if( status == 401 ){
        try{
          const response = await refresh.post('auth/refresh')
          const { access_token } = response.data
          
          console.log(response.data)

          setAccessToken(access_token)
        }
        catch (e: any){
          console.log(e)
        }
      }


      return error
    }, { synchronous: true }
  )
  
  return instance
}

function refreshCreate(baseURL: string, options?: any) {

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

