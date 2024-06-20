import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { componentPlugins } from './plugins/components.plugin'
import VueEasyLightbox from 'vue-easy-lightbox'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// i18n ?

app.use(vuetify)
app.use(componentPlugins)
app.use(VueEasyLightbox)

app.mount('#app')
