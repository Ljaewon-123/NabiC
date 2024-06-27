import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useFileToolbarStore = defineStore('fileToolbar', () => {
  const fileCheckList = ref<any[]>([]) 
  const allFileItemLen = ref<number>(0)

  const allFileItems = ref<any[]>([])

  // allCheck기능에 사용하기위한 push 인위적이고 좋지않음... 흠;;
  function checkItemPush(item:any){
    allFileItems.value.push(item)
  }

  return {
    checkItemPush,
    fileCheckList,
    allFileItemLen,
    allFileItems,
  }
})
