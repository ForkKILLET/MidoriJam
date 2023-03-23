import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../components/views/HomeView.vue'
import BookView from '../components/views/BookView.vue'
import AnalyzationView from '../components/views/AnalyzationView.vue'

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
    },
    {
        path: '/analyze',
        component: AnalyzationView,
        name: 'Analyzation'
    }
] as RouteRecordRaw[]
