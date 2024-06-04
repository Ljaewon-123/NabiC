import axios, { AxiosError } from "axios";
import { AxiosAPI } from ".";


export class AxiosUpload extends AxiosAPI {
  create(baseURL: string, options?: any) {

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
          this.throwReq()
        }
  
  
        return error
      }, { synchronous: true }
    )
    
    return instance
  }
}