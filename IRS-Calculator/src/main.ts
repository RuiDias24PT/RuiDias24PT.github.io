import './assets/theme.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'
import 'primevue/resources/themes/aura-light-blue/theme.css'

import Tooltip from 'primevue/tooltip'
const app = createApp(App)

app.directive('tooltip', Tooltip)
app.use(createPinia())
app.use(router)
app.use(PrimeVue)

app.mount('#app')
