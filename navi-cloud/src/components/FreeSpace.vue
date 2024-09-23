<template>
<v-card class="pa-4" height="70" elevation="0" border="md">
  <div class="d-flex align-center justify-space-between">
    <div class="d-flex gap-8">
      <strong>Total</strong>
      <strong>/</strong>
      <strong>{{ maxSpace }}GB</strong>
    </div>
    <div>Rest {{ restSpace }}</div>
  </div>
  <div>
    <v-progress-linear
    v-model="totalFileSize"
    color="blue-darken-3"
    height="5"
    rounded
    :max="maxFileSiz"
  ></v-progress-linear>
  </div>
</v-card>
</template>

<script setup lang="ts">
import { naviapi } from '@/boots/AxiosInstance';
import { useReloadStore } from '@/stores/reload';
import { formatBytes } from '@/utils';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue'

const reloadStore = useReloadStore()
const { reload } = storeToRefs(reloadStore)
const totalFileSize = ref(0)
const maxSpace = ref(20)
const maxFileSiz = computed(() => gigabytesToBytes(maxSpace.value))
const restSpace = computed(() => formatBytes(maxFileSiz.value - totalFileSize.value))

const getSpace = async() => {
  const space = await naviapi.get('user-data/space')
  console.log(space.data, '@@@')
  // console.log(formatBytes(space.data.totalFileSize))
  totalFileSize.value = space.data.totalFileSize
  maxSpace.value = space.data.hardSpace
}
// getSpace()

function gigabytesToBytes(gigabytes: number): number {
  const BYTES_IN_GIGABYTE = 1073741824; // 1 기가바이트 = 2^30 바이트
  return gigabytes * BYTES_IN_GIGABYTE;
}

watch( reload , async() => {
  await getSpace()
}, { immediate:true })

</script>