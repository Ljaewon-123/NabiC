import FileBox from "@/components/FileBox.vue";

export const componentPlugins = {
  install(app:any, options ?: any) {
    // 앱 환경설정
    app.component("file-box", FileBox);
  }
}