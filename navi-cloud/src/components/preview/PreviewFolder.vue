<template>
  <v-card
    v-ripple
    class="files pa-auto"
    width="150"
    height="150"
    style="cursor: pointer;"
    @click="pushRouter(props.itemFolder?.folderName)"
    :image="
      FOLDER_IMAGE
    "
  >
    <template #actions>
      <slot ></slot>
    </template>
  </v-card>
  

</template>

<script setup lang="ts">
import type { Folder, UserFile } from '@/types/FileBox';
import type { Buffer } from 'buffer';
import { computed, ref, type PropType } from 'vue'
import { useEasyLightbox } from 'vue-easy-lightbox';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  preview: String,
  item: Object as PropType<UserFile>,
  itemFolder: Object as PropType<Folder>,
  itemType: String,
  isFolder: Boolean,
  checkBoxHover: Boolean,
})

const router = useRouter()
const route = useRoute()

const FOLDER_IMAGE = '/assets/images/svgs/folder-fill.svg'


const pushRouter = (folderName?: string) => {
  // alert(folderName)
  if(props.checkBoxHover) return
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



</script>

<style scoped>

</style>

<style>
.files .file-icon{
  width:50%;
  height: 50%;
  top:25%;
  left:25%;
}
</style>