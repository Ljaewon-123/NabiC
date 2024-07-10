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
      <div class="d-flex justify-space-between">

        <div class="d-flex gap-8 align-center">
          <v-checkbox
            hide-details
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

        <div class="d-flex gap-8">
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

      </div>
    </v-col>
  </v-row>

  <v-divider></v-divider>
</v-container>

<outside-click-modal v-model="progressModal"
  :x-position="{ right: 3 }"  :top="90"
>
  <v-card>
    hello?
  </v-card>
</outside-click-modal>

<v-dialog
  v-model="newFolder"
  max-width="400"
>

  <v-card
    prepend-icon="mdi-folder-plus-outline"
    title="Create Folder?"
  >
    <template #text>
      <v-text-field
        v-model="newFolderName"
        hint="Enter your new folder name"
        placeholder="Foler Name"
        persistent-hint
        density="comfortable"
        :rules="requiredArr"
      ></v-text-field>
    </template>
    <template #actions>
      <v-spacer></v-spacer>

      <v-btn 
        color="primary" 
        variant="tonal" 
        @click="newFolder = false, createFolder()"
        @keyup.enter="createFolder()"
      >
        Save
      </v-btn>

      <v-btn color="error" variant="outlined" @click="newFolder = false">
        Cancel
      </v-btn>
    </template>
  </v-card>
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

interface DownloadData{
  id:number
  fileName: string
  file: { data: Buffer, type: "Buffer" }
}
interface DownloadError{
  error: 'download error'
}

const route = useRoute()
const progressModal = ref(true)

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
const { allFileItemLen, fileCheckList, allFileItems } = storeToRefs(selectedFiles)
const allCheck = ref<boolean>(false)
const toggleBtn = ref()
const newFolder = ref<boolean>(false)
const newFolderName = ref<string>('')

const createFolder = async() => {
  if(!newFolderName.value) return '전역 얼럿 띄우는 기능 추가 '
  const result = await naviapi.post('upload/create/folder', {
    fileName: newFolderName.value,
    depth: 0, // 임시로 0 
    directory: route.params.folderName
  }).then(() => trigger())

  console.log(result)
}

const requiredArr = [
  (v:string) => !!v || 'Field is required',
  (v: string) => /^[^\\\\/:*?"<>|]+$/.test(v) || "Don't use symbol",
]

const deleteFiles = async() => {
  await naviapi.delete('user-data', {
    data: {
      itemList: fileCheckList.value,
      directory: route.params.folderName ?? '/'
    }
  }).then(() => trigger())

}

const downloadFiles = async() => {
  const getData = await naviapi.post('user-data/download',{
    itemList: fileCheckList.value,
    directory: route.params.folderName ?? '/'
  },
  {
    onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
      console.log(progressEvent, '@@@@@@@@')
      console.log(percent);
    }
  })
  console.log(getData.data,' download')

  const downloadData = getData.data

  downloadData.forEach((
    files: DownloadData | DownloadData[] | DownloadError
  )=> {
    if(Array.isArray(files)) {
      files.forEach( file => {
        downloadBlob(file.file.data, file.fileName);
      })
    }

    //  자체적인 catch # 여러개 나오면 어떻할려고?? 상관없을듯 
    else if( 'error' in files) return '전역 에러얼럿 필요 ';

    // 흠... 
    else{
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
</style>