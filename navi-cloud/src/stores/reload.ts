import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useReloadStore = defineStore('reload', () => {
  const reload = ref(false)

  const trigger = () => {
    reload.value = !reload.value
  }

  const reloadReq = (...methods: Function[]) => {
    watch( reload , () => {
      methods.forEach( func => func())
    })
  }

  return {
    reload,
    trigger,
    reloadReq,
  }
})
