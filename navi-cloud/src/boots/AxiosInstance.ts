import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_APP_URL

export const naviapi = create(API_URL)
export const upload = createUpload(`${API_URL}/upload`)

function create(baseURL: string, options?: any) {

  const instance = axios.create(Object.assign({ baseURL }, options));

  // instance.defaults.withCredentials = true;
  
  instance.interceptors.request.use(
    config => {

      config.headers['Authorization'] = "Bearer " + `${localStorage.getItem('vtoken')}`

      return config
    }
  )

  instance.interceptors.response.use(
    response => {
      
      return response
    },
    async (error) => {

      if(error.code == 'ERR_CANCELED') return AxiosError

      const { config, response: { status }} = error

      if( status == 401 ){
        const response = await instance.post('auth/refresh')

        console.log(response.data)
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

      const { config, response: { status }} = error

      if( status == 401 ){
        const response = await instance.post('auth/refresh')

        console.log(response.data)
      }


      return error
    }, { synchronous: true }
  )
  
  return instance
}

