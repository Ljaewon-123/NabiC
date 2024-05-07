import 'vuetify/styles'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import { createVuetify, type IconOptions, type ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import { mdi } from 'vuetify/iconsets/mdi'
import { aliases, fa } from 'vuetify/iconsets/fa'
import { md } from 'vuetify/iconsets/md'

import { useDark } from '@vueuse/core'
import { computed } from 'vue'

import '@/styles/variables.scss'


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
    defaultSet: 'mdi', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
    // aliases,
    sets: {
      md,
      mdi
    },
  },
  components,
  directives,
})


