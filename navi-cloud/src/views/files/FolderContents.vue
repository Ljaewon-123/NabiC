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
      <template #error>
        <v-col cols="12" class="h-100" >
          <v-empty-state
            headline="Fail API Fetch"
            title="Please try again"
          ></v-empty-state>
        </v-col>
      </template>
  </stateful-renderer>
</v-row>
</v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { naviapi } from '@/boots/AxiosInstance';
import { useRoute, useRouter } from 'vue-router';
import type { Folder, UserFile } from '@/types/FileBox';
import { useReloadStore } from '@/stores/reload';
import { storeToRefs } from 'pinia';
import { useFileToolbarStore } from '@/stores/fileToolbar';
import { computed } from 'vue';

const reloadStore = useReloadStore()
const { trigger, reloadReq } = useReloadStore()
const { reload } = storeToRefs(reloadStore)
const selectedFiles = useFileToolbarStore()
const { clearCurrentItems } = useFileToolbarStore()
const { allFileItemLen, allFileItems, searchFilter } = storeToRefs(selectedFiles)
const route = useRoute()

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

const getUserData = async() => {
  downloadSuccess.value = false
  downloadError.value = false
  downloadLoading.value = true

  const result = await naviapi.post('user-data', route.params)
  // { "folder": "haha", "depth": "1" }
  // console.table(result.data)
  
  downloadLoading.value = false
  downloadSuccess.value = true

  allFileItems.value = []
  const data = result.data
  clearCurrentItems()
  files.value = data.files
  folders.value = data.folders

  allFileItemLen.value = data.files.length + data.folders.length
  
  return result
}
// getUserData()

watch(() => route.params, () =>{
  getUserData().catch(() => downloadError.value = true)
})

watch( reload , async() => {
  await Promise.allSettled([
    getUserData().catch(() => downloadError.value = true),
    Promise.reject('123')
  ]).then(console.log)
}, { immediate:true })
// reloadReq([
//   getUserData().catch(console.log),
// ])

</script>