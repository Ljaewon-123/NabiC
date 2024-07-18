import type FileBox from "@/components/FileBox.vue";
import type MdIcon from "@/components/MdIcon.vue"
import OutsideClickModal from "@/components/OutsideClickModal.vue";
import StatefulRenderer from "@/components/StatefulRenderer.vue";
import VLoading from "@/components/VLoading.vue";

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    FileBox: typeof FileBox,
    MdIcon: typeof MdIcon,
    OutsideClickModal: typeof OutsideClickModal,
    StatefulRenderer: typeof StatefulRenderer,
    VLoading: typeof VLoading
  }
}