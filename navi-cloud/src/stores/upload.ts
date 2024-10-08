import { defineStore, storeToRefs } from 'pinia'
import { useFileDialog } from '@vueuse/core'
import { upload } from '@/boots/AxiosInstance'
import { useRoute } from 'vue-router'
import { useReloadStore } from './reload'
import type { AxiosProgressEvent } from 'axios'
import { useProgressStore } from './progess'

interface Files extends File {
  lastModifiedDate: Date
}

// 이미 있는이름같은데 
export const useUpload = defineStore('upload', () => {

  const { trigger, reloadReq } = useReloadStore()

  const progressStore = useProgressStore()
  const { 
    startPromise,
    loadPromise,
    successPromise,
    getDownloadItems,
    catchPromise,
  } = useProgressStore()
  const { 
    downloadPercent,
  } = storeToRefs(progressStore)

  const route = useRoute()

  const { 
    files: folder, 
    open: folderOpen, 
    reset: folderReset, 
    onChange: folderOnChange 
  } = useFileDialog({
    directory: true
  })
  const { files, open, reset, onChange } = useFileDialog()
  
  onChange(async (files: FileList | null) => {
    if(!files) return 
  
    const formData = new FormData();
  
    Object.keys(files).forEach( (fileIndex: string) => {
      const file = files[Number(fileIndex)] as Files
      
      getDownloadItems({
        id: Number(fileIndex),
        fileName: file.name,
        fileType: file.type,
      })
      
      formData.append('files', file, file.name );
  
      formData.append('lastModified',  String(file.lastModified) )
      formData.append('lastModifiedDate', String(file.lastModifiedDate) )
      
    })
    formData.append('currentPath', 
      concatenateFolderNames(route.params.directory)
    )
    // route.params.folderName ?? '/'
    // console.log(files, typeof files)

    startPromise()
    const data = await upload.post('files', formData, {
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        loadPromise()
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
        console.log(percent, progressEvent);
        downloadPercent.value = percent
      },
    }).catch((data) => {
      catchPromise()
      return data
    })

    successPromise(data.status)

    trigger()
  
    reset()
  })
  
  // 빈폴더만 선택하면 아무것도 안온다 
  // 실직적으로 폴더 전송은 내부 파일만 보내는 거라서
  // 그래서 폴더 생성이 따로있는건가?? 
  folderOnChange( async( folders: FileList | null ) => {
    if(!folders) return 
  
    const files = folder.value as FileList 
    // console.log(files, 'folder???', typeof files)
  
    const formData = new FormData();
  
    // webkitRelativePath
    Object.keys(files).forEach( (fileIndex: string) => {
      const file = files[Number(fileIndex)] as Files
      getDownloadItems({
        id: Number(fileIndex),
        fileName: file.name,
        fileType: file.type,
      })
      formData.append('pathFiles', file );
      formData.append('lastModified',  String(file.lastModified) )
      formData.append('lastModifiedDate', String(file.lastModifiedDate) )
    })
  
    formData.append('currentPath', 
      concatenateFolderNames(route.params.directory)
    )
    
    startPromise()
    const data = await upload.post('folder', formData, {
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        loadPromise()
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
        console.log(percent, progressEvent);
        downloadPercent.value = percent
      },
    }).catch((data) => {
      catchPromise()
      return data
    })

    successPromise(data.status)

    trigger()
    
    folderReset()
  })

  function concatenateFolderNames(folderName: string | string[] | undefined){
    if(!folderName) return '/'
    if(Array.isArray(folderName)) return folderName.join('')

    return folderName
  }

  return {
    onChange ,
    folderOnChange ,
    folderOpen,
    open,
    files
  }

})
