<!-- 스타일 맞추기 힘드네 ;;; -->
<template>
<div  v-if="props.visibleSuccess" >
  <slot></slot>
</div>
<div v-if="props.visibleLoading" >
  <slot name="loading"></slot>
</div>
<div v-if="props.visibleError" >
  <slot name="error"></slot>
</div>
</template>

<script setup lang="ts">

const props = defineProps({
  visibleSuccess: {
    type: Boolean,
    default: true
  },
  visibleLoading: Boolean,
  visibleError: Boolean,
})

</script>