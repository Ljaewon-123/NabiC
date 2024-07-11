<!-- 스타일 맞추기 힘드네 ;;; -->
<template>
  <slot v-if="currentStatus == 'error'" name="error"></slot>
  <slot v-else-if="currentStatus == 'success'" ></slot>
  <slot v-else-if="currentStatus == 'loading'" name="loading">
    <v-loading :size="100" :width="4"></v-loading>
  </slot>
</template>

<script setup lang="ts">
import { computed } from 'vue';


const props = defineProps({
  stateSuccess: Boolean,
  stateLoading: Boolean,
  stateError: Boolean,
})

const currentStatus = computed(() => {
  if (props.stateError) return 'error';
  else if (props.stateSuccess)   return 'success';
  else if (props.stateLoading)   return 'loading';

  return 'loading';
});

</script>