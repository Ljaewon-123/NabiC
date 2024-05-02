<template>
  <q-layout view="lHh Lpr fFr">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> 요즘 이건 필수인데 이게 없네 </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Docs </q-item-label>

        <q-item
          clickable
          v-ripple
          exact
          v-for="(router, index) in routerLinks"
          :key="index"
          :to="{ name: router.link }"
        >
          <q-item-section avatar>
            <q-icon :name="router.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ router.title }}</q-item-label>
            <!-- <q-item-label caption>{{ 'caption' }}</q-item-label> -->
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page class="q-ma-sm">
        <!-- <keep-alive></keep-alive> -->
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const routerLinks = [
  {
    title: 'Dashboard',
    icon: 'o_dashboard',
    link: 'Dashboard',
  },
  {
    title: 'My Files',
    icon: 'o_folder',
    link: 'Myfiles',
  },
  {
    title: 'My Disks',
    icon: 'o_dns', // 원한는게 없네
    link: 'Mydisk',
  },
  {
    title: 'Private',
    icon: 'o_thumb_up',
    link: 'private',
  },
  {
    title: 'Favorites',
    icon: 'o_star',
    link: 'favorites',
  },
  {
    title: 'Trash',
    icon: 'o_delete',
    link: 'trash',
  },
  {
    title: 'Settings',
    icon: 'o_settings',
    link: 'settings',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
