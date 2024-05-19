<template>

<v-container fluid >
  <v-row>
    <v-col>
      <span class="main-title">
        MY CLOUD
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
              <v-list-item :value="1">
                <v-list-item-title @click="open">File Upload</v-list-item-title>
              </v-list-item>

              <v-list-item :value="2">
                <v-list-item-title @click="folderOpen" >Folder Upload</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn class="text-none" variant="tonal">
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

            <v-btn>최신순</v-btn>
            <v-btn>업로드순</v-btn>
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

</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useFileDialog } from '@vueuse/core'
import { naviapi, upload } from '@/boots/AxiosInstance';

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
    formData.append('files', files[Number(fileIndex)], files[Number(fileIndex)].name );
  })

  console.log(files, typeof files)
  await upload.post('files', formData)

})

folderOnChange( async( folders: FileList | null ) => {
  if(!folders) return 

  const files = folder.value as FileList 
  console.log(files, 'folder???', typeof files)

  const formData = new FormData();

  // webkitRelativePath
  Object.keys(files).forEach( (fileIndex: string) => {
    formData.append('pathFiles', files[Number(fileIndex)] );
  })

  
  await upload.post('folder', formData)
  
})


const allCheck = ref(false)
const toggleBtn = ref()

</script>

<style scoped>

</style>

<style>
.file-topbar .v-container{
  margin: 0 0;
}
</style>