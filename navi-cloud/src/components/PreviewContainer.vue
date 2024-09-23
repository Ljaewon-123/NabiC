<template>
<keep-alive>
  <suspense>
    <component 
    :is="dynamic" 
    v-bind="props"
    >
      <slot ></slot>
    </component>

    <template #fallback>
      <v-card
        width="150"
        height="150"
      >
        <v-loading></v-loading>
      </v-card>
    </template>
  </suspense>
</keep-alive>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';
import type { Folder, UserFile } from '@/types/FileBox';
import { defineAsyncComponent } from 'vue';

const PreviewAudio = defineAsyncComponent(() => import('@/components/preview/PreviewAudio.vue'));
const PreviewEtc = defineAsyncComponent(() => import('@/components/preview/PreviewEtc.vue'));
const PreviewFolder = defineAsyncComponent(() => import('@/components/preview/PreviewFolder.vue'));
const PreviewImage = defineAsyncComponent(() => import('@/components/preview/PreviewImage.vue'));
const PreviewVideo = defineAsyncComponent(() => import('@/components/preview/PreviewVideo.vue'));

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

