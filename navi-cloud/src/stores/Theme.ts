import { defineStore } from 'pinia'
import { useDark } from '@vueuse/core'

// 이미 있는이름같은데 
export const useThemeMode = defineStore('thememode', () => {

  const isDark = useDark({
    selector: 'body',
    attribute: 'color-scheme',
    valueDark: 'dark',
    valueLight: 'light'
  })

  //  후에 isDark ? '' : '' => 매소드로 ??  하나하나 isDark 할당해주는거 번거로움 
  /** isDark ? dark_code : light_code */
  const onThemeChange  = (dark:any, light: any) => {
    return isDark.value ? dark : light
  }

  return {
    isDark,
    onThemeChange,
  }

})
