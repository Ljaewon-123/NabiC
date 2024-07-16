<template>
<div ref="dropZoneRef" class="dropzone">
  <slot></slot>

  <div v-if="isOverDropZone" class="hover-message">
    You can only drag files
  </div>

</div>
</template>

<script setup lang="ts">
import { upload } from '@/boots/AxiosInstance';
import { useProgressStore } from '@/stores/progess';
import { useReloadStore } from '@/stores/reload';
import { useDropZone, useEventListener } from '@vueuse/core'
import type { AxiosProgressEvent } from 'axios';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

interface Files extends File {
  lastModifiedDate: Date
}

const dropZoneRef = ref<HTMLElement>()

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)


const route = useRoute()

const { trigger } = useReloadStore()

function concatenateFolderNames(folderName: string | string[] | undefined){
  if(!folderName) return '/'
  if(Array.isArray(folderName)) return folderName.join('')

  return folderName
}

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

async function onDrop(files: File[] | null) {
  if(!files) return 
  // console.log(files ,'@@@@@@@@@@@@@')

  const isFolder = Object.keys(files).some( (fileIndex: string) => {
    const file = files[Number(fileIndex)] as Files
    if(file.size == 0) return true
  })
  console.assert(!isFolder, 'is folder~!!')
  if(isFolder) return 'folder'
  
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
}




</script>

<style lang="scss">
.hover-message{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  z-index: 9990;
  
}


</style>