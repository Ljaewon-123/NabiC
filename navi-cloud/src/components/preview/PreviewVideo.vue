<template>
  <v-card
    v-ripple
    class="files pa-auto"
    width="150"
    height="150"
    @click="clickBox(props.item?.file.data)"
    style="cursor: pointer;"
  >
    <template #image>
      <v-icon color="deep-orange-lighten-1" class="file-icon" size="75">mdi-video</v-icon>
    </template>
    <template #actions>
      <slot ></slot>
    </template>
  </v-card>
  

<v-dialog
  v-model="dialog"
  fullscreen
>
  <v-btn
    color="#00000000"
    elevation="0"
    icon="mdi-close"
    @click="dialog = false"
  >
    <v-icon color="primary">mdi-close</v-icon>
  </v-btn>

  <div class="video-container" >
    <video controls width="100%" :height="height / 8" playsinline >
      <!-- <source :src="/media/cc0-videos/flower.webm" type="video/webm" /> -->
      <!-- <source :src="videoSrc" type="video/webm" /> -->
      <source :src="videoSrc"  type="video/mp4" />

    </video>
  </div>

</v-dialog>

</template>

<script setup lang="ts">
import type { Folder, UserFile } from '@/types/FileBox';
import type { Buffer } from 'buffer';
import { computed, ref, type PropType } from 'vue'
import { useDisplay } from 'vuetify';

const props = defineProps({
  preview: String,
  item: Object as PropType<UserFile>,
  itemFolder: Object as PropType<Folder>,
  itemType: String,
  isFolder: Boolean,
  checkBoxHover: Boolean,
})

const dialog = ref(false)
const videoSrc = ref()
const { height } = useDisplay()

const clickBox = (buffer?: Buffer) => {
  if(!buffer) return
  if(props.checkBoxHover) return
  dialog.value = true
  videoSrc.value = playVideo(buffer)
}


const playVideo = (buffer: Buffer) => {

  const blob = new Blob([new Uint8Array(buffer)]);
  return URL.createObjectURL(blob)

}



</script>

<style scoped>
.video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* for aspect ratio 16:9 */
  overflow: hidden;
}

.video-container video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80%;
  object-fit: cover;
}
</style>

<style>
.files .file-icon{
  width:50%;
  height: 50%;
  top:25%;
  left:25%;
}
</style>