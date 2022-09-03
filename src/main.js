import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Loading from 'vue-loading-overlay' //component
import 'vue-loading-overlay/dist/vue-loading.css' //style

createApp(App)
    .component('Loading', Loading)
    .mount('#app')
