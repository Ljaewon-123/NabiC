<template>
  <v-card
    v-ripple
    class="files pa-auto"
    width="150"
    height="150"
    style="cursor: pointer;"
    @click="clickBox(props.item?.file.data)"
  >
    <template #image>
      <v-icon class="file-icon" size="75">mdi-dots-horizontal-circle</v-icon>
    </template>
    <template #actions>
      <slot ></slot>
    </template>
  </v-card>
  

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



const clickBox = (buffer?: Buffer) => {
  // visibleRef.value = true
  // imgsRef.value = bufferToBase64(buffer)
}




</script>

<style scoped>

</style>

<style>
.files .file-icon{
  width:50%;
  height: 50%;
  top:25%;
  left:25%;
}
</style>