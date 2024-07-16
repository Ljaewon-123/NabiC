<template>
<v-container fluid class="h-100" 
  :class="{ 'd-flex justify-center align-center' :downloadLoading }" 
>

  <v-row class="mt-2">

    <stateful-renderer
    :state-success="downloadSuccess"
    :state-error="downloadError"
    :state-loading="downloadLoading"
    >
      <v-col class="d-flex ga-3 flex-wrap">
      
        <file-box
          v-for="folder in filteredFolders"
          :key="folder.id"
          :item-folder="folder"
          is-folder
        ></file-box>

        <file-box
          v-for="file in filteredFiles"
          :key="file.id"
          :item="file"
          :item-type="file.fileType"
        ></file-box>
      </v-col>
      <template #loading>
        <v-col cols="12" class="h-100" >
          <v-loading :size="100" :width="4" ></v-loading>
        </v-col>
      </template>
    </stateful-renderer>

  </v-row>
</v-container>
</template>
<!-- v-fade-transition -->
<script lang="ts" setup>
import { naviapi } from '@/boots/AxiosInstance';
import { ref, onMounted, computed, watchEffect, watch } from 'vue'
import type { Folder, UserFile } from '@/types/FileBox';
import { useRoute, useRouter } from 'vue-router';
import { useReloadStore } from '@/stores/reload';
import { storeToRefs } from 'pinia';
import { useFileToolbarStore } from '@/stores/fileToolbar';
import { useProgressStore } from '@/stores/progess';
// import { pushRouter } from '@/utils';

const reloadStore = useReloadStore()
const { trigger, reloadReq } = useReloadStore()
const { reload } = storeToRefs(reloadStore)
const selectedFiles = useFileToolbarStore()
const { clearCurrentItems } = useFileToolbarStore()
const { allFileItemLen, searchFilter } = storeToRefs(selectedFiles)

const downloadSuccess = ref(false)
const downloadError = ref(false)
const downloadLoading = ref(true)

const files = ref<UserFile[]>([])
const folders = ref<Folder[]>([])

const filteredFolders = computed(() => {
  return folders.value.filter(folder => folder.folderName.includes(searchFilter.value));
})

const filteredFiles = computed(() => {
  return files.value.filter(file => file.fileName.includes(searchFilter.value));
})

// const fileChecks = ref<any[]>([])
// watch(fileChecks,() => {
//   console.log(fileChecks.value)
// })

const getUserData = async() => {
  downloadSuccess.value = false
  downloadError.value = false
  downloadLoading.value = true

  const getUserData = await naviapi.get('user-data')

  downloadLoading.value = false
  downloadSuccess.value = true

  const data = getUserData.data
  clearCurrentItems()
  console.log(data)
  files.value = data.files
  folders.value = data.folders

  allFileItemLen.value = data.files.length + data.folders.length
  return getUserData
}
// getUserData()


watch( reload , async() => {
  await Promise.allSettled([
    getUserData().catch(() => downloadError.value = true),
    // Promise.reject('123').catch(console.log)
  ]).then(console.log)
}, { immediate:true })

// reloadReq([
//   () => getUserData().catch(console.log),
//   () => Promise.reject('123').catch(console.log)
// ])


</script>

<style scoped>
.main-title{
  font-weight: 600;
  font-size: 18px;
}
</style>

<style>
.files .v-card-actions{
  padding: 0px;
}

.files:hover{
  background-color: #e8f1f8;
  /* opacity: 0.5; */
}

.files img{
  width:50%;
  height: 50%;
  top:25%;
  left:25%;
}
</style>