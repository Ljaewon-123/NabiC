import { AxiosAPI } from "@/Axios";
import { AxiosUpload } from "@/Axios/upload";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import axios, { AxiosError } from "axios";


const API_URL = import.meta.env.VITE_APP_URL

// export const naviapi = create(API_URL)
// export const upload = createUpload(`${API_URL}/upload`)
const navi = new AxiosAPI()
const fileUpload = new AxiosUpload()
export const naviapi = navi.create(API_URL)
export const upload = fileUpload.create(`${API_URL}/upload`)