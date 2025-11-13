import { createApp } from 'vue'
import App from './App.vue'
import router from './router/'

// Build version: 2025-11-13
const app = createApp(App)

app.use(router)
app.mount('#app')
