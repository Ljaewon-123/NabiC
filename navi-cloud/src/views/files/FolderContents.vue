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
      @click="pushRouter(folder.folderName)"
      :item-folder="folder"
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

const reloadStore = useReloadStore()
const { trigger, reloadReq } = useReloadStore()

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
}
getUserData()

watch(() => route.params, () =>{
  getUserData()
})
reloadReq(getUserData)

</script>