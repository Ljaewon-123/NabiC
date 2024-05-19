import { ref } from "vue";

export class VSnack {
  snackbar = ref(false)
  snackMess = ref('')
  snackColor = ref('success')

  showSnack(mess: string, color?: string){
    this.snackMess.value = mess
    this.snackbar.value = true
    this.snackColor.value = color ?? ''
  }

}