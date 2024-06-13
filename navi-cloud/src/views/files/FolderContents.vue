<template>
  <h1>test? {{ route.params.directory }}</h1>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router';

const route = useRoute()

</script>