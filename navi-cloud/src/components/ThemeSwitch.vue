<template>
<v-card 
  width="40" height="22" rounded="pill" 
  elevation="0" variant="outlined"
  class="d-flex align-center bg-surface-light"
  style="cursor:pointer;"
  @click="switchTheme()"
  :ripple="false"
>
  <v-card 
    class="current  d-flex justify-center align-center" 
    style=" transition: left 0.5s ease; background-color: rgb(var(--v-theme-surface));"
    :style="{ left: `${current}px` }"
    rounded="circle"
    elevation="0" 
    variant="outlined"
  >
    <v-icon :color="themeOption.color" size="17" :icon="`md:${themeOption.icon}`"></v-icon>
  </v-card>

</v-card>
</template>

<script setup lang="ts">
import { useThemeMode } from '@/stores/theme';
import { useToggle } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed, nextTick, ref, shallowRef, watch, watchPostEffect } from 'vue'
import { useTheme } from 'vuetify';

const model = defineModel()

const theme = useTheme()
const thememode = useThemeMode()
const { isDark } = storeToRefs(thememode)
// thememode.toggleDark()

const themeOption = computed(() => {
  return {
    icon: theme.global.name.value == 'dark' ? 'dark_mode' : 'light_mode',
    color: theme.global.name.value == 'dark' ? 'blue-grey-lighten-1' : 'amber-lighten-3'
  }
})

// isDark.value ? left=0 : left=20 
// const switchTheme = () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
const switchTheme = async() => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
const toggleDark = useToggle(isDark)
const current = computed(() => theme.global.name.value == 'dark' ? 18 : 0)

watch(theme.global.name, () => {
  // alert('??')
  setTimeout(() => {
    toggleDark()
  },300)
},{flush:'post'})

</script>

<style scoped>

.current{
  /* background-color: var(--switch-color); */
  border-radius: 8px;
  transform: left 0.5s;
}
</style>