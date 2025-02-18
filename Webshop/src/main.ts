import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import { createPersistedState } from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import JsonViewer from 'vue3-json-viewer'

const app = createApp(App)
const pinia = createPinia()
pinia.use(
  createPersistedState({
    storage: sessionStorage,
  }),
)

app.use(pinia)
app.use(router)
app.use(JsonViewer)

app.mount('#app')
