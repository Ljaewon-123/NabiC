<template>
  <h1>DropZone</h1>
  <DropZone />
  <!-- <span class="file-info">File: {{ dropzoneFile.name }}</span> -->
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DropZone from '@/components/DropZone.vue';

const dropzoneFile = ref('')

</script>

