<template>
<div>
  <!-- '/assets/images/svgs/folder-fill.svg' -->
  <v-card
    v-ripple
    class="files pa-auto"
    @click="clickBox(props.item?.file.data, props.item?.fileType)"
    :image="
      !props.itemType ? FOLDER_IMAGE : fileRender(props.item?.file.data, props.item?.fileType)
    "
    width="150"
    height="150"
    @mouseover="mouseover = true"
    @mouseleave="mouseover = false"
    style="cursor: pointer;"
  >
    <template #image v-if="isFolder">
      <v-icon class="etc-icon" size="75">mdi-dots-horizontal-circle</v-icon>
    </template>
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
    <slot>
      <div class="text-center wrap-text">
        {{ props.item?.fileName || props.itemFolder?.folderName }}
      </div>
      <div class="text-center">
        {{ formatBytes(props.item?.size) }}
      </div>
    </slot>
  </div>

  <vue-easy-lightbox
    :visible="visibleRef"
    :imgs="imgsRef"
    :index="indexRef"
    @hide="onHide"
  />

</div>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import type { Buffer } from 'buffer';
import type { PropType } from 'vue'
import type { UserFile, Folder } from '@/types/FileBox';
import { formatBytes } from '@/utils'
import { useEasyLightbox } from 'vue-easy-lightbox';

const props = defineProps({
  item: Object as PropType<UserFile>,
  itemFolder: Object as PropType<Folder>,
  itemType: String  // undefined이면 폴더 
})

const {
  show, onHide, changeIndex,
  visibleRef, indexRef, imgsRef
} = useEasyLightbox({
  // src / src[]
  imgs: [],
  initIndex: 0
})

const isFolder = computed(() => {
  if(!props.itemType) return false
  if(props.itemType?.startsWith('image')) return false

  return true
})

const FOLDER_IMAGE = '/assets/images/svgs/folder-fill.svg'

const fileRender = (buffer: Buffer, type?: string) => {
  if(isFolder.value) return 
  if(!type) return  // why??/ undefined안해주고싶은데 
  // 이미지 , 문서 , 오디오만 보여주면됨 
  if(type.startsWith('image')){
    // const blob = new Blob([new Uint8Array(buffer)]);
    // const imageUrl = URL.createObjectURL(blob);
    const imageUrl = bufferToBase64(buffer)
    return imageUrl
  }

  return 
}
const clickBox = (buffer: Buffer, type?: string) => {
  if(!type) return
  if(type.startsWith('image')){
    visibleRef.value = true
    imgsRef.value = bufferToBase64(buffer)
  }
}

const bufferToBase64 = (buffer: Buffer) => {
  const blob = new Blob([new Uint8Array(buffer)]);
  return URL.createObjectURL(blob);
}


const star = ref(false)
const fileCheck = ref(false)
const mouseover = ref(false)


</script>

<style scoped>
.wrap-text {
  width: 150px;
  word-wrap: break-word; /* 또는 overflow-wrap: break-word; */
  white-space: normal;
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

.files .etc-icon{
  width:50%;
  height: 50%;
  top:25%;
  left:25%;
}
</style>