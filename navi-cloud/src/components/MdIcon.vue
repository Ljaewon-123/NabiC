<template>
  <span :style="{ width: props?.size ,height: props?.size }">
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  size: Number
})

</script>