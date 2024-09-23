<template>
  <v-breadcrumbs class="pathBread" :items="breadcrumbs" active-color="primary">
    <template #prepend>
      <v-icon icon="mdi-home" size="small"></v-icon>
    </template>
    <template #title="{ item }">
      {{ item.title.toUpperCase() }}
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const breadcrumbs = computed(() => {
  return [
    {
      title: 'root',
      to: { name: 'Root' }
    },
    ...pathItems.value
  ]
})

const pathItems = computed(() => {
  let paths: string | string[] = route.params.directory;
  if(!paths) return []
  
  if (!Array.isArray(paths)) {
    paths = paths.split('/')
  }

  return paths.map((path: string, index:number, arr: string[]) => {
    return {
      title: path,
      disabled: index == arr.length -1 ? true : false,
      to: {
        name: 'Path', 
        params: { 
          folderName: path, 
          directory: arr.slice(0, index + 1).join('/')
        } 
      }
    }
  })
})

</script>

<style>
.pathBread .v-breadcrumbs-item--disabled{
  opacity: 1;
}
</style>