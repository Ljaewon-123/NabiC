<template>
<v-container fluid class="h-100">
  <v-row>
    <v-col>
      <span class="main-title">
        MY CLOUD
      </span>
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <div class="d-flex justify-space-between">

        <div class="d-flex gap-8 align-center">
          <v-checkbox
            hide-details
            v-model="allCheck"
          ></v-checkbox>  
          <v-btn class="text-none" prepend-icon="md:upload" variant="tonal" color="primary">
            Button
          </v-btn>
          <v-btn class="text-none" variant="tonal">
            New Folder
          </v-btn>
          <v-btn class="text-none" variant="tonal">
            File type
          </v-btn>
        </div>

        <div class="d-flex gap-8">
          <v-speed-dial
            location="bottom center"
            transition="fade-transition"
          >
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn v-bind="activatorProps" icon="md:filter_list" variant="text"
              ></v-btn>
            </template>

            <v-btn>최신순</v-btn>
            <v-btn>업로드순</v-btn>
          </v-speed-dial>

          <v-btn-toggle
            v-model="toggleBtn"
            divided
          >
            <v-btn value="listView" icon="md:view_list"></v-btn>
            <v-btn value="iconView" icon="md:grid_view"></v-btn>
          </v-btn-toggle>
          
        </div>

      </div>
    </v-col>
  </v-row>

  <v-divider></v-divider>

  <v-row class="mt-2">
    <v-col>
      
      <v-card
        v-ripple
        class="files pa-auto"
        image="/assets/images/svgs/folder-fill.svg"
        width="150"
        height="150"
        @mouseover="mouseover = true"
        @mouseleave="mouseover = false"
        style="cursor: pointer; background-color: #90CAF9"
      >
        <template v-if="mouseover" #actions>

          <v-checkbox
            hide-details
            v-model="allCheck"
          ></v-checkbox>  

          <v-spacer></v-spacer>

          <v-btn
          
            v-model="star"
            @click="star = !star"
            :icon="star ? 'mdi-star' : 'mdi-star-outline' "
          ></v-btn>
        </template>
        
      </v-card>

    </v-col>
  </v-row>
</v-container>
</template>
<!-- v-fade-transition -->
<script lang="ts" setup>
import { ref } from 'vue'

const allCheck = ref(false)
const toggleBtn = ref()

const mouseover = ref(false)
const star = ref(false)


</script>

<style scoped>
.main-title{
  font-weight: 600;
  font-size: 18px;
}
</style>

<style>
.files .v-card-actions{
  padding: 0px;
}
</style>