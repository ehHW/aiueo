import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        component: () => import('@/views/Login/Login.vue'),
    },
    {
        path: '/layout',
        name: 'Layout',
        component: () => import('@/Layout/Layout.vue'),
        redirect: '/home',
        children: [],
    },
    {
        path: '/404',
        component: () => import('@/components/404.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404',
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router
