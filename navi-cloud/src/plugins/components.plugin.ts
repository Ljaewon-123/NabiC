import FileBox from "@/components/FileBox.vue";
import MdIcon from "@/components/MdIcon.vue"
import OutsideClickModal from '@/components/OutsideClickModal.vue'
import StatefulRenderer from '@/components/StatefulRenderer.vue'
import VLoading from '@/components/VLoading.vue'

export const componentPlugins = {
  install(app:any, options ?: any) {
    // 앱 환경설정
    app.component("file-box", FileBox);
    app.component("md-icon", MdIcon);
    app.component("outside-click-modal", OutsideClickModal),
    app.component("stateful-renderer", StatefulRenderer),
    app.component("v-loading", VLoading)
  }
}