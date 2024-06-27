<template>
<v-container fluid class="h-100" >

<v-row class="mt-2">
  <v-col class="d-flex ga-3">

    <!-- {{ route.params.folderName }}
    //
    <br>
    {{ result.data }} -->
    <file-box
      v-for="folder in folders"
      :key="folder.id"
      :item-folder="folder"
      is-folder
    ></file-box>

    <file-box
      v-for="file in files"
      :key="file.id"
      :item="file"
      :item-type="file.fileType"
    ></file-box>

  </v-col>
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

const reloadStore = useReloadStore()
const { trigger, reloadReq } = useReloadStore()
const { reload } = storeToRefs(reloadStore)
const selectedFiles = useFileToolbarStore()
const { allFileItemLen } = storeToRefs(selectedFiles)
const router = useRouter()
const route = useRoute()
const pushRouter = (folderName: string) => {
  router.push({ 
    name: 'Path', 
    params: { 
      folderName: folderName, 
      directory: `${route.params.directory}/${folderName}`
    } 
  })

}

const files = ref<UserFile[]>([])
const folders = ref<Folder[]>([])

const getUserData = async() => {
  const result = await naviapi.post('user-data', route.params)
  // { "folder": "haha", "depth": "1" }
  console.table(result.data)
  const data = result.data

  files.value = data.files
  folders.value = data.folders

  allFileItemLen.value = data.files.length + data.folders.length
}
// getUserData()

watch(() => route.params, () =>{
  getUserData()
})

watch( reload , async() => {
  await Promise.allSettled([
    getUserData().catch(console.log),
    Promise.reject('123').catch(console.log)
  ])
}, { immediate:true })
// reloadReq([
//   getUserData().catch(console.log),
// ])

</script>