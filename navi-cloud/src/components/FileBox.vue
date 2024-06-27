<template>
<div>
  <!-- '/assets/images/svgs/folder-fill.svg' -->
  <v-card
    v-ripple
    class="files pa-auto"
    @click="clickBox(props.item?.file.data, props.item?.fileType, props.itemFolder?.folderName ,checkBoxHover)"
    :image="
      props.isFolder ? FOLDER_IMAGE : fileRender(props.item?.file.data, props.item?.fileType)
    "
    width="150"
    height="150"
    @mouseover="mouseover = true"
    @mouseleave="mouseover = false"
    style="cursor: pointer;"
  >
    <template #image v-if="fileType">
      <v-icon class="etc-icon" size="75">mdi-dots-horizontal-circle</v-icon>
    </template>
    <template v-if="selected" #actions>

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
    
  </v-card>
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

  <vue-easy-lightbox
    :visible="visibleRef"
    :imgs="imgsRef"
    :index="indexRef"
    @hide="onHide"
  />

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


const mouseover = ref(false)
const star = ref(false)
const checkBoxHover = ref(false)

const fileType = computed(() => {
  if(!props.itemType) return false
  if(props.itemType?.startsWith('image')) return false

  return true
})

const FOLDER_IMAGE = '/assets/images/svgs/folder-fill.svg'

// onUpdated(() => {
//   console.log('update??')
// })

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

const {
  show, onHide, changeIndex,
  visibleRef, indexRef, imgsRef
} = useEasyLightbox({
  // src / src[]
  imgs: [],
  initIndex: 0
})

const itemType = (fileAction:any, folderAction: any) => {
  if(props.item) return fileAction

  return folderAction
}

const pushRouter = (folderName?: string) => {
  // alert(folderName)
  if(!folderName) return 
  router.push({ 
    name: 'Path', 
    params: { 
      folderName: folderName, 
      directory: rootDivision(route.params.directory as string, folderName)
    } 
  })

}

function rootDivision(directory: any, folderName:any){
  if(!directory) return folderName

  return `${directory}/${folderName}`
}
/** 파일 vs 폴더 옵션 */
function typeOption(fileItem: {name?:string, type?: string}, folderItem: {name?:string, type?: string}){
  if(!props.isFolder) return fileItem
  return folderItem
}


const fileRender = (buffer: Buffer, type?: string) => {
  if(fileType.value) return 
  if(!type) return  // why??/ undefined안해주고싶은데 
  // 이미지 , 문서 , 오디오만 보여주면됨 
  if(type.startsWith('image')){
    // const blob = new Blob([new Uint8Array(buffer)]);
    // const imageUrl = URL.createObjectURL(blob);
    const imageUrl = bufferToBase64(buffer)
    return imageUrl
  }

  return 
}

// click로 구분하는 방법 간단하게 hover변수로 구분하는 방법 후자로 해봄 
const clickBox = (buffer: Buffer, type?: string, folderName?:string, checkBoxHover?:boolean) => {
  if(checkBoxHover) return 
  if(!type) return pushRouter(folderName)
  if(type.startsWith('image')){
    visibleRef.value = true
    imgsRef.value = bufferToBase64(buffer)
  }
}

const bufferToBase64 = (buffer: Buffer) => {
  const blob = new Blob([new Uint8Array(buffer)]);
  return URL.createObjectURL(blob);
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
  white-space: normal;
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