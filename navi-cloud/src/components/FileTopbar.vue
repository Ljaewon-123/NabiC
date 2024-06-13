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
      ></v-text-field>
    </template>
    <template #actions>
      <v-spacer></v-spacer>

      <v-btn color="primary" variant="tonal" @click="newFolder = false">
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
import { ref, type Ref } from 'vue';
import { useFileDialog } from '@vueuse/core'
import { naviapi, upload } from '@/boots/AxiosInstance';

interface Files extends File {
  lastModifiedDate: Date
}

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

    const file = files[Number(fileIndex)] as Files
    
    formData.append('files', file, file.name );

    formData.append('lastModified',  String(file.lastModified) )
    formData.append('lastModifiedDate', String(file.lastModifiedDate) )
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


const allCheck = ref<boolean>(false)
const toggleBtn = ref()
const newFolder = ref<boolean>(false)
const newFolderName = ref<string>()



</script>

<style scoped>

</style>

<style>
.file-topbar .v-container{
  margin: 0 0;
}
</style>