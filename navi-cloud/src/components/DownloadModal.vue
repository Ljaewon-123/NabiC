<template>
<v-card>
  <v-container style="height: 400px;">
    <v-row
      align-content="center"
      class="fill-height"
      justify="center"
    >
      <stateful-renderer
      :state-success="downloadSuccess"
      :state-error="downloadError"
      :state-loading="downloadLoading"
      >
        <v-col
          class="text-subtitle-1 text-center"
          cols="12"
        >
          <v-list height="380" lines="two">
            <v-list-item
              v-for="file, index in downloadItems"
              :key="file.id ?? index"
              :title="file.fileName"
            >
              <template v-slot:prepend>
                <v-avatar color="deep-purple-accent-4">
                  <v-icon color="white">
                    {{ fileType(file.fileType) }}
                  </v-icon>
                </v-avatar>
              </template>
            </v-list-item>
          </v-list>
        </v-col>
        <template #loading>
          <v-col
            class="text-subtitle-1 text-center"
            cols="12"
          >
            Getting your files
          </v-col>
          <v-col cols="6" class="text-center">
            <v-progress-linear
              v-model="downloadPercent"
              color="deep-purple-accent-4"
              height="6"
              rounded
            ></v-progress-linear>
            <span>{{ downloadPercent }}%</span>
          </v-col>
        </template>
        <template #error>
          fail download please try again
        </template>
      </stateful-renderer>
    </v-row>
  </v-container>
</v-card>
</template>

<script setup lang="ts">
import { useProgressStore } from '@/stores/progess';
import { storeToRefs } from 'pinia';

const progressStore = useProgressStore()
const { 
  progressModal,
  downloadSuccess,
  downloadError,
  downloadLoading,
  downloadItems,
  downloadPercent,
} = storeToRefs(progressStore)

const fileType = (itemType?: string) => {
  console.assert(itemType == undefined, 'is must not undeifned')
  if(!itemType) return 
  const type = itemType.split('/')[0]
  switch(type){
    case 'image' : return "mdi-image"
    case "audio":  return "mdi-volume-high"
    case "video" : return "mdi-video-outline"
    case "error" : return "mdi-alert-circle"
    default : return "mdi-dots-horizontal-circle"
  }
}


</script>