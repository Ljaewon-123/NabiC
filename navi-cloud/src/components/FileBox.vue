<template>
<div 
@mouseover="mouseover = true"
@mouseleave="mouseover = false"
>
  <!-- '/assets/images/svgs/folder-fill.svg' -->
  <preview-container
    :preview="props.isFolder ? 'folder' : props.itemType?.split('/')[0]"
    :check-box-hover="checkBoxHover"
    v-bind="props"
  >
    <template v-if="selected" >

      <v-checkbox
        v-model="fileCheckList"
        color="blue-darken-4"
        hide-details
        @mouseover="checkBoxHover = true"
        @mouseleave="checkBoxHover = false"
        :value="itemType(
          { 
            id: props.item?.id,
            name: props.item?.fileName, 
            type: props.itemType,
            isFolder: props.isFolder,
            data: ''
          }  , 
          { 
            id: props.itemFolder?.id,
            name: props.itemFolder?.folderName, 
            type: props.itemType,
            isFolder: props.isFolder,
            data: ''
          }
        )"
      ></v-checkbox>  

      <v-spacer></v-spacer>

      <!-- <v-btn
        color="blue-darken-4"
        v-model="star"
        @click="star = !star"
        :icon="star ? 'mdi-star' : 'mdi-star-outline' "
      ></v-btn> -->
      
    </template>
    
  </preview-container>
  <div>
    <slot>
      <div class="text-center wrap-text">
        {{ props.item?.fileName || props.itemFolder?.folderName }}
      </div>
      <div class="text-center">
        {{ formatBytes(props.item?.size) }}
      </div>
    </slot>
  </div>

</div>
</template>

<script setup lang="ts">
import { computed, ref, toRef, watch, onUpdated } from 'vue'
import type { Buffer } from 'buffer';
import type { PropType } from 'vue'
import type { UserFile, Folder } from '@/types/FileBox';
import { formatBytes } from '@/utils'
import { useEasyLightbox } from 'vue-easy-lightbox';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useFileToolbarStore } from '@/stores/fileToolbar';
import PreviewFile from '@/components/PreviewFile.vue'
import PreviewContainer from './PreviewContainer.vue';

interface CheckType{
  name: string
  type: string
}
const props = defineProps({
  item: Object as PropType<UserFile>,
  itemFolder: Object as PropType<Folder>,
  itemType: String,  // undefined이면 폴더  # 명시적으로 하나더 만들까? 
  isFolder: Boolean,
})

// 여기서는 pinia로 해야 성능이 훨씬더 좋아짐 model을 사용하면 
// 한번 체크박스 클릭당 전부 업데이트 그리고 model이 배열이고 복잡한 객체라서 
// 이를 구분하기가 어려움 :active="item.id === activeId"이런식으로는 못해줌 
// const fileCheck = defineModel<CheckType[]>('check', { default: [] })

const router = useRouter()
const route = useRoute()
const selectedFiles = useFileToolbarStore()
const { checkItemPush } = useFileToolbarStore()
const { fileCheckList, allFileItems } = storeToRefs(selectedFiles)

// onUpdated(() => console.log('update!'))

const mouseover = ref(false)
const star = ref(false)
const checkBoxHover = ref(false)



const selected = computed(() => {
  if(!fileCheckList.value) return mouseover.value
  // mouseover.value : fileCheck.value
  const itemObj = typeOption(
    { name: props.item?.fileName, type: props.itemType }  , 
    { name: props.itemFolder?.folderName, type: props.itemType }
  )
  const hoverItemVisable = fileCheckList.value.some( check => {
    if(check.name == itemObj.name  && check.type == itemObj.type) return true
  })

  // console.log('?', hoverItemVisable)
  return hoverItemVisable ? true : mouseover.value
})


const itemType = (fileAction:any, folderAction: any) => {
  if(props.item) return fileAction

  return folderAction
}

/** 파일 vs 폴더 옵션 */
function typeOption(fileItem: {name?:string, type?: string}, folderItem: {name?:string, type?: string}){
  if(!props.isFolder) return fileItem
  return folderItem
}




// 좋지않음....
checkItemPush(
  itemType(
    { 
      id: props.item?.id,
      name: props.item?.fileName, 
      type: props.itemType,
      isFolder: props.isFolder,
      data: ''
    }  , 
    { 
      id: props.itemFolder?.id,
      name: props.itemFolder?.folderName, 
      type: props.itemType,
      isFolder: props.isFolder,
      data: ''
    }
  )
)

</script>

<style scoped>
.wrap-text {
  width: 150px;
  word-wrap: break-word; /* 또는 overflow-wrap: break-word; */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  display: box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  /* white-space: normal; */
  /* white-space: nowrap; */
}
</style>

<style>
.files .v-card-actions{
  padding: 0px;
}

.files:hover{
  background-color: #e8f1f8;
  /* opacity: 0.5; */
}

.files img{
  width:50%;
  height: 50%;
  top:25%;
  left:25%;
}

.files .etc-icon{
  width:50%;
  height: 50%;
  top:25%;
  left:25%;
}
</style>