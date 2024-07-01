import 'vuetify/styles'
import { createVuetify, type IconOptions, type ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { mdi } from 'vuetify/iconsets/mdi'
import { aliases, fa } from 'vuetify/iconsets/fa'
import { md } from 'vuetify/iconsets/md'

import { useDark } from '@vueuse/core'
import { computed } from 'vue'

import '@/styles/variables.scss'

import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'

// import('@mdi/font/css/materialdesignicons.css')
// .catch(error => {
//   console.error('CSS 파일 로드 중 오류가 발생했습니다:', error);
// });

const isDark = useDark({
  selector: 'body',
  attribute: 'color-scheme',
  valueDark: 'dark',
  valueLight: 'light'
})

const changeDark = computed(() => isDark.value == true ? 'dark' : 'light')

export default createVuetify({
  theme: {
    defaultTheme: changeDark.value,
    themes: {
      light: {
        dark:false,
        // colors:{
        //   background: '#ffffff',
        // }
      },
      dark: {
        dark: true,
        // colors:{
        //   background: '#1A1A1A',
        // }
      },
    },

  },
  icons: {
    defaultSet: 'mdi',
    // aliases,
    sets: {
      md,
      mdi
    },
  },
  components,
  directives,
})


