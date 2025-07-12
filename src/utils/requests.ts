import axios from 'axios'
import { useUserStore } from '@/stores/useUser'

axios.defaults.withCredentials = true

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    timeout: 5000,
    withCredentials: true,
})

// export const instance2 = axios.create({
//     baseURL: 'http://127.0.0.1:8000',
//     timeout: 5000,
// })

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        const userStore = useUserStore()
        const token = userStore.userInfo.token

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        if (config.method === 'post') {
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        }
        return config
    },
    (error) => {
        return Promise.reject(error.name)
    },
)

// 响应拦截器
instance.interceptors.response.use(
    (res) => {
        // console.log(res)
        if (res.data.state === 401) {
            ElMessage.error(res.data.msg)
            return Promise.reject(res.data.msg)
        } else {
            return res
        }
    },
    (error) => {
        return Promise.reject(error)
    },
)

export default instance
