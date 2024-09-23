<template>
<v-card
  v-ripple
  class="files pa-auto"
  width="150"
  height="150"
  style="cursor: pointer;"
  @click="clickBox(props.item?.file.data)"
  :image="
    fileRender(props.item?.file.data)
  "
>
  <template #actions>
    <slot ></slot>
  </template>
</v-card>

<vue-easy-lightbox
  :visible="visibleRef"
  :imgs="imgsRef"
  :index="indexRef"
  @hide="onHide"
/>
</template>

<script setup lang="ts">
import type { Folder, UserFile } from '@/types/FileBox';
import type { Buffer } from 'buffer';
import { computed, ref, type PropType } from 'vue'
import { useEasyLightbox } from 'vue-easy-lightbox';

const props = defineProps({
  preview: String,
  item: Object as PropType<UserFile>,
  itemFolder: Object as PropType<Folder>,
  itemType: String,
  isFolder: Boolean,
  checkBoxHover: Boolean,
})

const {
  show, onHide, changeIndex,
  visibleRef, indexRef, imgsRef
} = useEasyLightbox({
  // src / src[]
  imgs: [],
  initIndex: 0
})


const clickBox = (buffer?: Buffer) => {
  if(!buffer) return
  if(props.checkBoxHover) return
  visibleRef.value = true
  imgsRef.value = bufferToBase64(buffer)
}

// 이제 이거는 항상 이미지임 
const fileRender = (buffer?: Buffer) => {
  if(!buffer) return
  // 이미지 , 문서 , 오디오만 보여주면됨 
  // const blob = new Blob([new Uint8Array(buffer)]);
  // const imageUrl = URL.createObjectURL(blob);
  const imageUrl = bufferToBase64(buffer)
  return imageUrl 


  // else if(type.startsWith('video')){
  //   return 'mdi-video'
  // }
  // else if(type.startsWith('audio')){
  //   return 'mdi-volume-high'
  // }
}

const bufferToBase64 = (buffer: Buffer) => {
  const blob = new Blob([new Uint8Array(buffer)]);
  return URL.createObjectURL(blob);
}





</script>

<style scoped>

</style>