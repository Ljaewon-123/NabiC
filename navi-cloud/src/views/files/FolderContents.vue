<template>
  <h1>test? {{ route.params }}</h1>
  <h2>result {{ result.data }}</h2>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { naviapi } from '@/boots/AxiosInstance';
import { useRoute } from 'vue-router';

const route = useRoute()

const result = await naviapi.post('user-data', route.params)
// { "folder": "haha", "depth": "1" }
</script>