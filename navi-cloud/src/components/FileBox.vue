<template>
<div>
  <v-card
    v-ripple
    class="files pa-auto"
    :image="fileRender(props.item.file.data, props.item.fileType)"
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
    <div>{{ props.item.fileName }}</div>
    <div>{{ props.item.size }}</div>
  </div>
</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Buffer } from 'buffer';
import type { PropType } from 'vue'
import type { File } from '@/types/FileBox';

const props = defineProps({
  item: {
    type: Object as PropType<File>,
    required: true
  },
  isFolder: String
})

const isFolder = computed(() => {
  if(!props.isFolder) return false
  if(props.isFolder?.startsWith('image')) return false

  return true
})

const fileRender = (buffer: Buffer, type: string) => {
  if(isFolder.value) return 
  // 이미지 , 문서 , 오디오만 보여주면됨 
  if(type.startsWith('image')){
    const blob = new Blob([new Uint8Array(buffer)]);
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl
  }

  return 
}


const star = ref(false)
const fileCheck = ref(false)
const mouseover = ref(false)


</script>

<style scoped>

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