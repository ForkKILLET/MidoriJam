import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../components/views/HomeView.vue'
import BookView from '../components/views/BookView.vue'

export default [
    {
        path: '/',
        component: HomeView,
        name: 'Home'
    },
    {
        path: '/book',
        component: BookView,
        name: 'Book'
    }
] as RouteRecordRaw[]
