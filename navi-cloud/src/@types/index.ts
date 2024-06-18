import type FileBox from "@/components/FileBox.vue";

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    FileBox: typeof FileBox,
  }
}