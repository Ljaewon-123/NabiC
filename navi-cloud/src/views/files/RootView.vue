<template>
<v-container fluid class="h-100" >

  <v-row class="mt-2">
    <v-col class="d-flex ga-3 flex-wrap">
      <!-- '/assets/images/svgs/folder-fill.svg' -->

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
<!-- v-fade-transition -->
<script lang="ts" setup>
import { naviapi } from '@/boots/AxiosInstance';
import type { Buffer } from 'buffer';
import { ref, onMounted, computed, watchEffect, watch } from 'vue'
import type { Folder, UserFile } from '@/types/FileBox';
import { useRoute, useRouter } from 'vue-router';
import { useReloadStore } from '@/stores/reload';
import { storeToRefs } from 'pinia';
import { useFileToolbarStore } from '@/stores/fileToolbar';
// import { pushRouter } from '@/utils';

const reloadStore = useReloadStore()
const { trigger, reloadReq } = useReloadStore()
const { reload } = storeToRefs(reloadStore)
const selectedFiles = useFileToolbarStore()
const { clearCurrentItems } = useFileToolbarStore()
const { allFileItemLen, allFileItems } = storeToRefs(selectedFiles)

const router = useRouter()
const route = useRoute()
const pushRouter = (folderName: string) => {
  router.push({ 
    name: 'Path', 
    params: { 
      folderName: folderName, 
      directory: folderName
    } 
  })
}
const files = ref<UserFile[]>([])
const folders = ref<Folder[]>([])

// const fileChecks = ref<any[]>([])
// watch(fileChecks,() => {
//   console.log(fileChecks.value)
// })

const getUserData = async() => {
  const getUserData = await naviapi.get('user-data')
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
    getUserData(),
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