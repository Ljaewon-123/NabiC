import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import axios, { AxiosError } from "axios";
import { refresh } from "./refresh";

const { setAccessToken, getAccessToken, setToken } = useAuthStore()

export class AxiosAPI {

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
  
        if(error.code == 'ERR_CANCELED') return AxiosError
  
        console.log(error, 'errorj')
        const { config, response: { status }} = error
  
        if( status == 401 ){
          // alert(getAccessToken())
          const res = await this.throwReq()
          config.headers['Authorization'] = "Bearer " + res.accessToken
          return instance.request(config)

        }
  
        return Promise.reject(error)
      }, { synchronous: true }
    )
    
    return instance
  }

  protected async throwReq(){
    try{
      const response = await refresh.post('auth/refresh')
      const tokens = response.data

      console.log(response.data)

      setToken(tokens)

      return tokens
    }
    catch (e: any){
      console.log(e)
    }
  }
  

}