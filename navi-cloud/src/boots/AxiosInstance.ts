
const API_URL = import.meta.env.VITE_APP_URL

export function create(baseURL: string, options?: any) {
  
  const instance = axios.create(Object.assign({ baseURL }, options));

  instance.defaults.withCredentials = true;
  
  instance.interceptors.request.use(
    config => {

      config.headers['Authorization'] = "Bearer " + 'TOKEN'

      return config
    }
  )

  instance.interceptors.response.use(
    response => {
      
      return response
    },
  )
  
  return instance
}
