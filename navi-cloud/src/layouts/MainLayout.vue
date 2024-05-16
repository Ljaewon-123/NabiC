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
  <v-list  >

    <template v-for="link, index in links" :key="index">

      <template v-for="child, childIndex in link.children" :key="childIndex">
        <v-list-group v-if="child.children" >

          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :title="child.title"
            ></v-list-item>
          </template>

          <v-list-item
            v-for="grandchild, grandIndex in child.children"
            :key="grandIndex"
            :prepend-icon="grandchild.icon"
            :title="grandchild.title"
            :value="grandchild.title"
            :active-color="'blue-darken-3'"
          ></v-list-item>

        </v-list-group>

        <v-list-item
          v-else
          :title="child.title"
          :value="child.title"
          :active-color="'blue-darken-3'"
        ></v-list-item>
        
      </template>


    <v-divider></v-divider>

    </template>
  </v-list>

  <template #append>
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
const spareCapacity = ref(30)

const links = [
  { type: 'mngt' ,
    children: [
      { title: 'All files', url: ''},
      { title: 'Recent', url: '', 
      children:[
          { title: 'Recent Upload', url: '', icon: '' },
          { title: 'Recent Open', url: '', icon: '' }
        ] 
      },
      { title:"Favorites" , url: ''}
    ]
  },

  { type: 'files',
    children: [
      { title: 'Pictures', url: '',  },
      { title: 'Videos', url: '',  },
      { title: 'Document', url: '',  },
    ]
  }
]

</script>

<style scoped>
.v-list-group .v-list-item{
  padding: 4px 16px !important;
}

</style>