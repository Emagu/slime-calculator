import { createApp } from 'vue'
import VueCryptojs from 'vue-cryptojs'
import './style.css'
import App from './App.vue'

createApp(App)
    .use(VueCryptojs)
    .mount('#app')
