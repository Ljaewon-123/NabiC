<template>
<component 
:is="dynamic" 
v-bind="props"
>
  <slot ></slot>
</component>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';
import PreviewAudio from './preview/previewAudio.vue';
import PreviewEtc from './preview/previewEtc.vue';
import PreviewFolder from './preview/previewFolder.vue';
import PreviewImage from './preview/previewImage.vue';
import PreviewVideo from './preview/previewVideo.vue';
import type { Folder, UserFile } from '@/types/FileBox';

const props = defineProps({
  preview: {
    type: String,
    default: 'etc'
  },
  item: Object as PropType<UserFile>,
  itemFolder: Object as PropType<Folder>,
  itemType: String,
  isFolder: Boolean,
  checkBoxHover: Boolean,
})

// console.log(props.preview, '|||||||')

const dynamic = computed(() => {
  switch (props.preview) {
    case 'image': return PreviewImage
    case 'audio' : return PreviewAudio
    case 'folder' : return PreviewFolder
    case 'video' : return PreviewVideo

    default: return PreviewEtc
  }
})

</script>

