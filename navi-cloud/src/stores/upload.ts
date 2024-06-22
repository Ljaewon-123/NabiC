import { defineStore } from 'pinia'
import { useFileDialog } from '@vueuse/core'
import { upload } from '@/boots/AxiosInstance'
import { useRoute } from 'vue-router'

interface Files extends File {
  lastModifiedDate: Date
}

// 이미 있는이름같은데 
export const useUpload = defineStore('upload', () => {

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
  
    console.log(files, typeof files)
    await upload.post('files', formData)
  
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
  
    formData.append('parentName', route.params.folder as string );
    
    await upload.post('folder', formData)
    
    folderReset()
  })

  return {
    onChange ,
    folderOnChange ,
    folderOpen,
    open,
    files
  }

})
