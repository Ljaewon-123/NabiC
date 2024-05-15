<template>

<v-app-bar :elevation="2">
  <template v-slot:prepend>
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
  </template>

  <v-app-bar-title>Application Bar</v-app-bar-title>
</v-app-bar>

<v-navigation-drawer
  v-model="drawer"
  temporary
>
  <v-list>
    <v-list-item></v-list-item>
  </v-list>
</v-navigation-drawer>
  
<v-main
  class="d-flex align-center justify-center"
>
  <!-- style="min-height: 300px" -->
  <RouterView/>
</v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const drawer = ref()

</script>