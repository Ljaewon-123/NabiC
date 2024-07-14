<template>

<v-container fluid >
  <v-row>
    <v-col class="pa-0 px-2">
      <span class="main-title">
        <file-router-path></file-router-path>
      </span>
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <!-- <div class="d-flex justify-space-between"> -->

        <div class="d-flex gap-8 align-center">
          <v-checkbox
            hide-details
            min-width="40"
            v-model="allCheck"
            @change="toggleAll"
          ></v-checkbox>  
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn 
                v-bind="props"
                class="text-none" 
                prepend-icon="md:upload" 
                variant="tonal" 
                color="primary"
              >
                Upload
              </v-btn>
            </template>
            <v-list >
              <v-list-item @click="open">
                <v-list-item-title >File Upload</v-list-item-title>
              </v-list-item>

              <v-list-item @click="folderOpen">
                <v-list-item-title  >Folder Upload</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn v-if="!hasSelectedFiles"
            @click="newFolder = true" 
            class="text-none" 
            variant="tonal"
          >
            New Folder
          </v-btn>

          <div v-if="hasSelectedFiles"
          class="d-flex gap-8 align-center"
          >
            <span >|</span>
            <v-btn
              @click="downloadFiles"
              class="text-none" 
              variant="tonal"
            >
              Download
            </v-btn>
            <v-btn
              @click="deleteFiles"
              class="text-none" 
              variant="tonal"
            >
              Delete
            </v-btn>
          </div>


          <template v-if="files">
            <p>You have selected: <b>{{ `${files.length} ${files.length === 1 ? 'file' : 'files'}` }}</b></p>
            <li v-for="file of files" :key="file.name">
              {{ file.name }}
            </li>
          </template>
        </div>
      </v-col>
      <v-col >
        <div class="d-flex gap-8 align-center">

          <v-text-field 
          v-model="search"
          class="bar-search"
          label="Search" variant="outlined"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          hide-details
          clearable
          ></v-text-field>

          <v-speed-dial
            location="bottom center"
            transition="fade-transition"
          >
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn v-bind="activatorProps" icon="md:filter_list" variant="text"
              ></v-btn>
            </template>

            <v-btn :key="1" >최신순</v-btn>
            <v-btn :key="2" >업로드순</v-btn>
          </v-speed-dial>

          <v-btn-toggle
            v-model="toggleBtn"
            divided
          >
            <v-btn value="listView" icon="md:view_list"></v-btn>
            <v-btn value="iconView" icon="md:grid_view"></v-btn>
          </v-btn-toggle>
          
        </div>

      <!-- </div> -->
    </v-col>
  </v-row>

  <v-divider></v-divider>
</v-container>

<!-- 로딩화면, 에러화면, 완료시 화면 근데 이건 suspense가 아님  -->
<outside-click-modal v-model="progressModal"
  :x-position="{ right: 3 }"  :top="45"
  :width="380"
>
  <download-modal></download-modal>
</outside-click-modal>

<v-dialog
  v-model="newFolder"
  max-width="400"
>
  <create-new-folder
    v-model="newFolder"
    v-model:name="newFolderName"
  ></create-new-folder>
</v-dialog>

</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect, type Ref } from 'vue';
import { useFileDialog } from '@vueuse/core'
import { naviapi, upload } from '@/boots/AxiosInstance';
import { useUpload } from '@/stores/upload';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useFileToolbarStore } from '@/stores/fileToolbar';
import { useReloadStore } from '@/stores/reload';
import FileRouterPath from '@/components/FileRouterPath.vue'
import type { Buffer } from 'buffer';
import type { AxiosProgressEvent } from 'axios';
import CreateNewFolder from '@/components/CreateNewFolder.vue'
import { useProgressStore } from '@/stores/progess';
import DownloadModal from '@/components/DownloadModal.vue'

interface DownloadData{
  id:number
  fileName: string
  file: { data: Buffer, type: "Buffer" }
  fileType: string
}
interface DownloadError{
  error: 'download error'
}
interface DownloadErrorType{
  id?: number
  fileName: 'download error'
  fileType: "error/error"
}

const route = useRoute()

const progressStore = useProgressStore()
const { 
  startPromise,
  loadPromise,
  successPromise,
  getDownloadItems,
  catchPromise,
} = useProgressStore()
const { 
  progressModal,
  downloadPercent,
} = storeToRefs(progressStore)
const { 
  onChange, 
  folderOnChange ,
  folderOpen,
  open,
} = useUpload()
const uploadStore = useUpload()
const { trigger } = useReloadStore()
// 전역으로 files가 유지되면.. 단점.. 안바뀔지도?? reset으로 해결??
// 현재 파일들 어디서나 가져올수있는건 괜찮음 
const { files } = storeToRefs(uploadStore)
const selectedFiles = useFileToolbarStore()
const { allFileItemLen, fileCheckList, allFileItems, search } = storeToRefs(selectedFiles)
const allCheck = ref<boolean>(false)
const toggleBtn = ref()
const newFolder = ref<boolean>(false)
const newFolderName = ref<string>('')



const deleteFiles = async() => {
  await naviapi.delete('user-data', {
    data: {
      itemList: fileCheckList.value,
      directory: route.params.folderName ?? '/'
    }
  }).then(() => trigger())

}

const downloadFiles = async() => {

  startPromise()

  const getData = await naviapi.post('user-data/download',{
    itemList: fileCheckList.value,
    directory: route.params.folderName ?? '/'
  },
  {
    onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
      loadPromise()

      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
      console.log(progressEvent, '@@@@@@@@')
      console.log(percent);
      downloadPercent.value = percent
    }
  }).catch((data) => {
    // 서버에서 에러처리를 따로해서 흠...
    // 성공한 데이터는 저장으로 처리하고싶은데... 아닌가??
    // 여기는 통신상태에서 완전히 실패했을때를 가정
    catchPromise()
    return data
  })

  successPromise(getData.status)

  console.log(getData.data,' download', getData)

  const downloadData = getData.data

  downloadData.forEach((
    files: DownloadData | DownloadData[] | DownloadError
  )=> {
    if(Array.isArray(files)) {
      files.forEach( file => {
        getDownloadItems(file)
        downloadBlob(file.file.data, file.fileName);
      })
    }

    //  자체적인 catch # 여러개 나오면 어떻할려고?? 상관없을듯 
    else if( 'error' in files) {
      getDownloadItems({
        fileName: 'download error',
        fileType: 'error/error'
      })
      return 
    }

    // 흠... 
    else{
      // downloadItems.value.push(files)
      getDownloadItems(files)
      downloadBlob(files.file.data, files.fileName);
    }
  })

  // trigger()
}

function downloadBlob(buffer:Buffer, filename: string) {
  // Blob 생성
  const blob = new Blob([new Uint8Array(buffer)]);
  const url = URL.createObjectURL(blob);

  // a 태그 생성
  const a = document.createElement('a');
  a.href = url;
  a.download = filename; 

  document.body.appendChild(a);
  a.click();

  // a 태그와 URL 객체 정리
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

watch(newFolder, () => {
  newFolderName.value = ''
})


const hasSelectedFiles = computed(() => fileCheckList.value.length != 0 ? true : false )

const toggleAll = () => {
  if(!allFileItemLen.value) return
  if(!allCheck.value) return fileCheckList.value = []
  
  // 가장 베스트는 없는거만 넣어주는건데...
  fileCheckList.value = []
  allFileItems.value.forEach( file => fileCheckList.value.push(file) )
  
}


watch(() => (fileCheckList.value), () => {
  if(fileCheckList.value.length == allFileItemLen.value) return allCheck.value = true

  allCheck.value = false
})


</script>

<style scoped>

</style>

<style>
.file-topbar .v-container{
  margin: 0 0;
}

.bar-search .v-input__control{
  height: 40px;
}


</style>