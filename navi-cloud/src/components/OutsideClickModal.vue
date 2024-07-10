<template>
<!-- 이게 더 좋나  -->
<!-- <v-slide-y-transition></v-slide-y-transition> -->
<Teleport to="body">
<Transition name="bounce">
  <v-card v-if="model" class="modal"
  :style="{
    top: props.top + '%',
    left: props.xPosition.left + '%',
    right: props.xPosition.right + '%',
  }"
  >
    <v-toolbar density="compact">
      <v-btn
        icon="mdi-close"
        @click="model = false"
      ></v-btn>
    </v-toolbar>

    <slot></slot>

  </v-card>
</Transition>
</Teleport>
</template>

<script setup lang="ts">

const model = defineModel({ default: false })
const props = defineProps({
  xPosition: {
    type: Object,
    default() {
      return{
        left: null,
        right: null
      }
    }
  },
  top:{
    type: Number,
    default: 50
  }
})


</script>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}

.modal {
  position: fixed;
  z-index: 999;
  right:0;
  margin-left: -150px;
}
</style>
