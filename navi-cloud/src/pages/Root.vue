<template>
<v-container fluid class="h-100">

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
        style="cursor: pointer;"
      >
        <template v-if="mouseover" #actions>

          <v-checkbox
          v-model="fileCheck"
            color="blue-darken-4"
            hide-details
          ></v-checkbox>  

          <v-spacer></v-spacer>

          <v-btn
            color="blue-darken-4"
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
import { useRouter } from 'vue-router';

const router = useRouter()

const fileCheck = ref(false)

const mouseover = ref(false)
const star = ref(false)

// const test = () => {
//   router.push({ name: 'Path',  params: { directory: 'eduardo' }})
// }

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
</style>