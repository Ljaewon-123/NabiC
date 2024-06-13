<template>
<v-container fluid class="h-100" >

  <v-row class="mt-2">
    <v-col class="d-flex ga-3">

      <v-card
        v-for="file in files"
        :key="file.id"
        v-ripple
        class="files pa-auto"
        :image="'/assets/images/svgs/folder-fill.svg'"
        width="150"
        height="150"
        @mouseover="mouseover = true"
        @mouseleave="mouseover = false"
        style="cursor: pointer;"
      >
        <template v-if="mouseover" #actions>

          <v-checkbox
            v-model="fileCheck"
            color="blue-darken-4"
            hide-details
          ></v-checkbox>  

          <v-spacer></v-spacer>

          <v-btn
            color="blue-darken-4"
            v-model="star"
            @click="star = !star"
            :icon="star ? 'mdi-star' : 'mdi-star-outline' "
          ></v-btn>
        </template>
        
      </v-card>

      <div>
        aefg
        <img :src="imageSrc" alt="뭐야" />
      </div>
      <div>
        <input
          type="file"
          accept="image/png, image/jpeg"
          @change="image = $event.target.files[0]"
        />
        <br />
        <img v-if="image" :src="base64" width="200" />
        <strong>{{  image }}</strong>
      </div>
      <!-- <div>
        <v-btn @click="">test</v-btn>
        <div ref="preview"></div>
      </div> -->

    </v-col>
  </v-row>
</v-container>
</template>
<!-- v-fade-transition -->
<script lang="ts" setup>
import { naviapi } from '@/boots/AxiosInstance';
import type { Buffer } from 'buffer';
import { ref, onMounted, computed, watchEffect } from 'vue'
import { useRouter } from 'vue-router';
import { useBase64 } from '@vueuse/core'

interface File {
  fileName: string
  fileType:  string
  file: { data: Buffer }
  id: number
  lastModified:  string
  lastModifiedDate:  string
  size: number
}
interface Folder{
  depth: number
  folderName: string
}

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

const imgBuffer = data.files[0].file.data;

const { base64: test } = useBase64(files.value[0].file.data)

const image = ref('');
const { base64 } = useBase64(image);
const test2 = ref()

console.log(imgBuffer)
const imageSrc = ref()
const blob = new Blob([new Uint8Array(imgBuffer)], { type: 'image/png' });
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