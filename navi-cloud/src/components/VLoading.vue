<template>
  <div class="d-flex align-center justify-center fill-height">
    <v-progress-circular
      :size="props.size"
      :width="props.width"
      :color="props.color"
      indeterminate
    ></v-progress-circular>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  size: {
    type: Number,
    default: 50,
  },
  width: {
    type: Number,
    default: 8
  },
  color: {
    type:String,
    default: "grey-lighten-4"
  }
})
</script>