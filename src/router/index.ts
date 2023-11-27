import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AudioView from '../views/AudioView.vue'
import MessagesView from "@/views/MessagesView.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/audio',
        name: 'audio',
        component: AudioView
    },
    {
        path: '/messages',
        name: 'messages',
        component: MessagesView
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
