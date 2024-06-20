<template>

<v-container fluid >
  <v-row>
    <v-col>
      <span class="main-title">
        ROOT
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

          <v-btn @click="newFolder = true" class="text-none" variant="tonal">
            New Folder
          </v-btn>


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
import { ref, watch, watchEffect, type Ref } from 'vue';
import { useFileDialog } from '@vueuse/core'
import { naviapi, upload } from '@/boots/AxiosInstance';
import { useUpload } from '@/stores/upload';
import { storeToRefs } from 'pinia';


const { 
  onChange, 
  folderOnChange ,
  folderOpen,
  open,
} = useUpload()
const uploadStore = useUpload()
// 전역으로 files가 유지되면.. 단점.. 안바뀔지도?? reset으로 해결??
// 현재 파일들 어디서나 가져올수있는건 괜찮음 
const { files } = storeToRefs(uploadStore)

const allCheck = ref<boolean>(false)
const toggleBtn = ref()
const newFolder = ref<boolean>(false)
const newFolderName = ref<string>('')

const createFolder = async() => {
  if(!newFolderName.value) return '전역 얼럿'
  const result = await naviapi.post('upload/create/folder', {
    fileName: newFolderName.value,
    depth: 0
  });

  console.log(result)
}

const requiredArr = [
  (v:string) => !!v || 'Field is required',
  (v: string) => /^[^\\\\/:*?"<>|]+$/.test(v) || "Don't use symbol",
]

watch(newFolder, () => {
  newFolderName.value = ''
})


</script>

<style scoped>

</style>

<style>
.file-topbar .v-container{
  margin: 0 0;
}
</style>