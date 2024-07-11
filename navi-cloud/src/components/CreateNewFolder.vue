<template>
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
</template>

<script setup lang="ts">
import { naviapi } from '@/boots/AxiosInstance';
import { useReloadStore } from '@/stores/reload';
import { useRoute } from 'vue-router';

const { trigger } = useReloadStore()

const route = useRoute()
const newFolderName = defineModel('name' ,{ default: '' })
const newFolder = defineModel({ default: false })

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
</script>