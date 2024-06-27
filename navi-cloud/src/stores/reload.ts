import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useReloadStore = defineStore('reload', () => {
  const reload = ref(false)

  const trigger = () => {
    reload.value = !reload.value
  }

  // 아직좀 불안정하네 .....
  const reloadReq = (methods: Function[]) => {
    watch( reload , async() => {
      // methods.forEach( func => func())
      await Promise.allSettled(methods)
    })
  }

  return {
    reload,
    trigger,
    reloadReq,
  }
})
