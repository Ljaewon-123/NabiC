<template>

<v-app-bar :elevation="2">
  <template v-slot:prepend>
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
  </template>

  <v-app-bar-title 
    style="cursor: pointer;" @click="router.push('/main')"
  >
    MY CLOUD
  </v-app-bar-title>

  <v-spacer></v-spacer>

  <theme-switch ></theme-switch>

  <v-icon>mdi-account</v-icon>
  <v-icon>mdi-account</v-icon>
  <v-icon>mdi-account</v-icon>
  <v-icon>mdi-account</v-icon>
  <v-icon>mdi-account</v-icon>
  <v-icon>mdi-account</v-icon>
  <v-icon>mdi-account</v-icon>

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
            :color="'blue-darken-3'"
          ></v-list-item>

        </v-list-group>

        <v-list-item
          v-else
          :to="child.url"
          :title="child.title"
          :value="child.title"
          :color="'blue-darken-3'"
        ></v-list-item>
        
      </template>


    <v-divider></v-divider>

    </template>
  </v-list>

  <template #append>
    <free-space></free-space>
  </template>

</v-navigation-drawer>
  
<v-main
  class="d-flex align-center justify-center"
>
<v-app-bar 
class="w-100 file-topbar"
height="140" elevation="0" >
  <file-topbar></file-topbar>
</v-app-bar>
  
  <RouterView/>
</v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FileTopbar from '@/components/FileTopbar.vue';
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import { useRouter } from 'vue-router';
import FreeSpace from '@/components/FreeSpace.vue'

const router = useRouter()

const drawer = ref()


const links = [
  { type: 'mngt' ,
    children: [
      { title: 'All Files', url: { name: 'Root' }},
      { title: 'Recent', url: '', 
      children:[
          { title: 'Recent Upload', url: '', icon: 'mdi-folder-upload' },
          { title: 'Recent Open', url: '', icon: 'mdi-folder-open' }
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

