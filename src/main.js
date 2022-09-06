import { createApp } from 'vue'
import './style.css'
import Init from './Init.vue'
import Loading from 'vue-loading-overlay' //component
import 'vue-loading-overlay/dist/vue-loading.css' //style
import VueCookies from 'vue-cookies'

createApp(Init).use(VueCookies, {expires: '7d', path: '/', domain: '', secure: 'true', sameSite: 'None'})
               .component('Loading', Loading)
               .mount('#app');
