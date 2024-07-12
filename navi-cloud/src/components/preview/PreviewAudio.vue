<template>
  <v-card
    class="files pa-auto"
    width="150"
    height="150"
    style="cursor: pointer;"
    @click="clickBox(props.item?.file.data)"
  >
    <template #image>
      <v-icon color="green-accent-2" class="file-icon" size="75">mdi-volume-high</v-icon>
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

  <div class="d-flex justify-center">
    <div class="container d-flex flex-column align-center">
      <v-icon :class="{ 'spinner' : isPlay }" icon="md:slow_motion_video" size="600" ></v-icon>
      <figure class="d-flex flex-column align-center">
        <audio id="audioPlayer" ref="audioPlayer" :src="audioSrc" controls ></audio>
        <figcaption class="w-50 ">{{ props.item?.fileName }}</figcaption>
      </figure>
    </div>
  </div>

</v-dialog>

</template>

<script setup lang="ts">
import { useThemeMode } from '@/stores/theme';
import type { Folder, UserFile } from '@/types/FileBox';
import type { Buffer } from 'buffer';
import { computed, onMounted, ref, watch, type PropType } from 'vue'

const props = defineProps({
  preview: String,
  item: Object as PropType<UserFile>,
  itemFolder: Object as PropType<Folder>,
  itemType: String,
  isFolder: Boolean,
  checkBoxHover: Boolean,
})

const { onThemeChange } = useThemeMode()

const dialog = ref(false)
const audioSrc = ref()
const audioPlayer = ref()
const isPlay = ref(false)

// 오디오 클릭
const clickBox = (buffer: Buffer) => {
  if(props.checkBoxHover) return
  dialog.value = true
  audioSrc.value = playAudio(buffer)
}

const playAudio = (buffer: Buffer) => {

  console.log(audioPlayer.value)

  const blob = new Blob([new Uint8Array(buffer)]);
  return URL.createObjectURL(blob)
  // const audio = new Audio(URL.createObjectURL(blob))
  // audio.play()
}

watch( audioPlayer, () => {
  // const audio = document.getElementById('audioPlayer');
  // console.log(audio)
  // console.log(audioPlayer.value)

  if(!audioPlayer.value) return

  // Add event listeners for play and pause events
  audioPlayer.value.addEventListener('play', () => {
    console.log('Audio started playing');
    isPlay.value = true
  });

  audioPlayer.value.addEventListener('pause', () => {
    console.log('Audio paused');
    isPlay.value = false
  });

})


</script>

<style scoped>
.container{
  width: 700px;
}
.wrap-word{
  word-wrap: break-word; /* 또는 overflow-wrap: break-word; */
  white-space: normal
}
.audio-close {
  position: fixed;
  top: 15;         
  left: 15;        
  z-index: 1000;  
}
.spinner {

  animation: spin 5s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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