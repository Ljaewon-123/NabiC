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
  <v-list-item
    prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
    title="John Leider"
  ></v-list-item>

  <v-divider></v-divider>

  <v-list density="compact" nav>
    <v-list-item prepend-icon="mdi-view-dashboard" title="Home" value="home"></v-list-item>
    <v-list-item prepend-icon="mdi-forum" title="About" value="about"></v-list-item>
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