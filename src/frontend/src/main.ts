import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import routes from './utils/routes'

import './style.css'

createApp(App)
    .use(createRouter({
        routes,
        history: createWebHashHistory()
    }))
    .mount('#app')
