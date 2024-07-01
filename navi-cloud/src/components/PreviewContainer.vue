<template>
<keep-alive>
  <Suspense>
    <component 
    :is="dynamic" 
    v-bind="props"
    >
      <slot ></slot>
    </component>

    <template #fallback>
      로딩중...
    </template>
  </Suspense>
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

// import PreviewAudio from '@/components/preview/previewAudio.vue';
// import PreviewEtc from '@/components/preview/previewEtc.vue';
// import PreviewFolder from '@/components/preview/previewFolder.vue';
// import PreviewImage from '@/components/preview/previewImage.vue';
// import PreviewVideo from '@/components/preview/previewVideo.vue';

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

