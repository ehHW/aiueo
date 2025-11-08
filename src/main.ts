import '@/assets/css/user_friend/iconfont.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import './permission'

// 引入echarts
// import Echarts from 'vue-echarts'
// import * as echarts from 'echarts'

const app = createApp(App)

// 使用组件
// app.component('e-charts', Echarts)
// 全局挂载 echarts
// app.config.globalProperties.$echarts = echarts

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

import { getMenuApi } from '@/api/menu'
import { useUserStore } from '@/stores/useUser'

const init = async () => {
    const userStore = useUserStore()
    const modules = userStore.modules
    await userStore.refreshToken()
    await getMenuApi().then((res) => {
        if (res.data.state === 200) {
            // console.log(res.data.data)
            for (const item of res.data.data) {
                for (const child of item.children) {
                    // console.log(modules[`..${child.component.slice(1)}`])
                    router.addRoute('Layout', {
                        path: child.path,
                        component: modules[`..${child.component.slice(1)}`],
                        meta: { name1: item.auth_name, name2: child.auth_name },
                    })
                }
            }
        }
    },
    (error) => {
        if (error.status === 401) {
            userStore.logout()
        }
    })
}
;(async () => {
    await init()
    // console.log(router.getRoutes())
    app.use(router)
    app.mount('#app')
})()
