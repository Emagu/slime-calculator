import { createApp } from 'vue'
import './style.css'
import Init from './Init.vue'
import Loading from 'vue-loading-overlay' //component
import 'vue-loading-overlay/dist/vue-loading.css' //style

createApp(Init)
    .component('Loading', Loading)
    .mount('#app')
