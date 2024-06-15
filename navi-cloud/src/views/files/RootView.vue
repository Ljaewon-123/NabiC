<template>
<v-container fluid class="h-100" >

  <v-row class="mt-2">
    <v-col class="d-flex ga-3">
      <!-- '/assets/images/svgs/folder-fill.svg' -->
      <file-box
        v-for="file in files"
        :key="file.id"
        :item="file"
        :is-folder="file.fileType"
      ></file-box>

    </v-col>
  </v-row>
</v-container>
</template>
<!-- v-fade-transition -->
<script lang="ts" setup>
import { naviapi } from '@/boots/AxiosInstance';
import type { Buffer } from 'buffer';
import { ref, onMounted, computed, watchEffect } from 'vue'
import FileBox from '@/components/FileBox.vue';
import type { Folder, File } from '@/types/FileBox';


const fileCheck = ref(false)

const mouseover = ref(false)
const star = ref(false)

const files = ref<File[]>([])
const folders = ref<Folder[]>([])
const userItems = computed(() => {
  return {
    files: files.value,
    folders: folders.value
  }
})

const getUserData = await naviapi.get('user-data')
const data = getUserData.data
console.log(data)
files.value = data.files
folders.value = data.folders

const fileRender = (buffer: Buffer, type: string) => {
  // 이미지 , 문서 , 오디오만 보여주면됨 
  if(type.startsWith('image')){
    const blob = new Blob([new Uint8Array(buffer)]);
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl
  }

  return 
}

// buffer image보여주기 
const imgBuffer = data.files[0].file.data;

console.log(imgBuffer)
const imageSrc = ref()
const blob = new Blob([new Uint8Array(imgBuffer)], { type: 'image' });
const imageUrl = URL.createObjectURL(blob);
imageSrc.value = imageUrl;

function readFile() {
  const file = files.value[0].file.data; // 첨부된 파일을 가져옴
  
  const reader = new FileReader();


}


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