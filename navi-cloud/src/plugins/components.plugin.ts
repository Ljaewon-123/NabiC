import FileBox from "@/components/FileBox.vue";
import MdIcon from "@/components/MdIcon.vue"
import OutsideClickModal from '@/components/OutsideClickModal.vue'

export const componentPlugins = {
  install(app:any, options ?: any) {
    // 앱 환경설정
    app.component("file-box", FileBox);
    app.component("md-icon", MdIcon);
    app.component("outside-click-modal", OutsideClickModal)
  }
}