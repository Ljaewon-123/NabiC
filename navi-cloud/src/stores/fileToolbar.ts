import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useFileToolbarStore = defineStore('fileToolbar', () => {
  const fileCheckList = ref<BoxType[]>([])  // 현재 체크된 파일들
  const allFileItemLen = ref<number>(0) // allFileItems이 filebox에서 추가되기때문데 이 변수는 가지고있어야한다.

  const allFileItems = ref<BoxType[]>([])

  // allCheck기능에 사용하기위한 push 인위적이고 좋지않음... 흠;;
  function checkItemPush(item: BoxType){
    allFileItems.value.push(item)
  }
  function clearCurrentItems(){
    allFileItems.value = []
  }

  return {
    checkItemPush,
    clearCurrentItems,
    fileCheckList,
    allFileItemLen,
    allFileItems,
  }
})
