<template>
<v-card class="pa-4" height="70" elevation="0" border="md">
  <div class="d-flex align-center justify-space-between">
    <div class="d-flex gap-8">
      <strong>currnet</strong>
      <strong>/</strong>
      <strong>res</strong>
    </div>
    <div>여유 {{ 'test' }}</div>
  </div>
  <div>
    <v-progress-linear
    v-model="spareCapacity"
    color="blue-darken-3"
    height="5"
    rounded
  ></v-progress-linear>
  </div>
</v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const spareCapacity = ref(30)

</script>