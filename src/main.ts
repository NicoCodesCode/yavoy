import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Material from '@primeuix/themes/material'
import 'primeicons/primeicons.css'
import '@/main.css'
import { createPinia } from 'pinia'

const app = createApp(App)

app.use(router)

app.use(PrimeVue, { theme: { preset: Material } })
app.use(createPinia())

app.mount('#app')
