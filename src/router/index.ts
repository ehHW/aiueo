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
        children: [
            // {
            //     path: '/home',
            //     component: () => import('@/views/Home/Home.vue'),
            //     meta: { name1: '后台首页', name2: '首页' },
            // },
            // {
            //     path: '/console',
            //     component: () => import('@/views/Home/Console.vue'),
            //     meta: { name1: '首页', name2: '控制台' },
            // },
            // {
            //     path: '/office/chat',
            //     component: () => import('@/views/Office/Chat.vue'),
            //     meta: { name1: '办公', name2: '聊天' },
            // },
            // {
            //     path: '/office/excel',
            //     component: () => import('@/views/Office/Excel.vue'),
            //     meta: { name1: '办公', name2: '协同表格' },
            // },
            // {
            //     path: '/office/file',
            //     component: () => import('@/views/Office/File.vue'),
            //     meta: { name1: '办公', name2: '公共文件' },
            // },
            // {
            //     path: '/user',
            //     component: () => import('@/views/User/index.vue'),
            //     meta: { name1: '用户管理', name2: '用户列表' },
            // },
            // {
            //     path: '/user/create',
            //     component: () => import('@/views/User/CreateUser.vue'),
            //     meta: { name1: '用户管理', name2: '用户创建' },
            // },
            // {
            //     path: '/role',
            //     component: () => import('@/views/Role/index.vue'),
            //     meta: { name1: '角色管理', name2: '角色列表' },
            // },
            // {
            //     path: '/role/create',
            //     component: () => import('@/views/Role/CreateRole.vue'),
            //     meta: { name1: '角色管理', name2: '角色创建' },
            // },
            // {
            //     path: '/auth',
            //     component: () => import('@/views/Auth/index.vue'),
            //     meta: { name1: '权限管理', name2: '权限列表' },
            // },
            // {
            //     path: '/auth/create',
            //     component: () => import('@/views/Auth/CreateAuth.vue'),
            //     meta: { name1: '权限管理', name2: '权限创建' },
            // },
        ],
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
