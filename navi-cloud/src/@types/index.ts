import type FileBox from "@/components/FileBox.vue";
import type MdIcon from "@/components/MdIcon.vue"

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    FileBox: typeof FileBox,
    MdIcon: typeof MdIcon,
  }
}