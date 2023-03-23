import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import routes from './utils/routes'
import bookData, { kBookData } from './utils/data'
import './style.css'


createApp(App)
    .use(createRouter({
        routes,
        history: createWebHashHistory()
    }))
    .provide(kBookData, bookData)
    .mount('#app')
