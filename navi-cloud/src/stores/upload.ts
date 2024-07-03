import { defineStore, storeToRefs } from 'pinia'
import { useFileDialog } from '@vueuse/core'
import { upload } from '@/boots/AxiosInstance'
import { useRoute } from 'vue-router'
import { useReloadStore } from './reload'

interface Files extends File {
  lastModifiedDate: Date
}

// 이미 있는이름같은데 
export const useUpload = defineStore('upload', () => {

  const reloadStore = useReloadStore()
  const { trigger, reloadReq } = useReloadStore()
  const { reload } = storeToRefs(reloadStore)

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
      
      formData.append('files', file, file.name );
  
      formData.append('lastModified',  String(file.lastModified) )
      formData.append('lastModifiedDate', String(file.lastModifiedDate) )
      
    })
    formData.append('currentPath', 
      concatenateFolderNames(route.params.folderName)
    )
    // route.params.folderName ?? '/'
  
    console.log(files, typeof files)
    await upload.post('files', formData)

    trigger()
  
    reset()
  })
  
  // 빈폴더만 선택하면 아무것도 안온다 
  // 실직적으로 폴더 전송은 내부 파일만 보내는 거라서
  // 그래서 폴더 생성이 따로있는건가?? 
  folderOnChange( async( folders: FileList | null ) => {
    if(!folders) return 
  
    const files = folder.value as FileList 
    console.log(files, 'folder???', typeof files)
  
    const formData = new FormData();
  
    // webkitRelativePath
    Object.keys(files).forEach( (fileIndex: string) => {
      const file = files[Number(fileIndex)] as Files
      formData.append('pathFiles', file );
      formData.append('lastModified',  String(file.lastModified) )
      formData.append('lastModifiedDate', String(file.lastModifiedDate) )
    })
  
    formData.append('currentPath', 
      concatenateFolderNames(route.params.folderName)
    )
    
    await upload.post('folder', formData)

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
