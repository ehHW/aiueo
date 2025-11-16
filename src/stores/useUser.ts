import type { LoginParams, UserInfo } from '@/types/user'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import useRouterTo from '@/hooks/useRouterTo'
import { getMenuApi } from '@/api/menu'
import { loginApi, logoutApi } from '@/api/user'
import { refreshTokenApi } from '@/api/user'
import type { MenuListChildren, MenuListData } from '@/types/menu'
import router from '@/router'

export const useUserStore = defineStore(
    'user',
    () => {
        const modules = import.meta.glob(['../views/*/*.vue'])
        const menuList = ref<MenuListData<MenuListChildren>[]>([])
        const userInfo = reactive<UserInfo>({
            user_id: 0,
            username: '',
            token: '',
            mobile: '',
            role_id: '',
            role_name: '',
            avatar: '',
            expires_in: 0,
        })
        const refreshToken = async () => {
            let state = false
            await refreshTokenApi()
                .then((res) => {
                    if (res.data.state === 200) {
                        userInfo.token = res.data.data.token
                        userInfo.expires_in = res.data.data.expires_in
                        state = true
                    }
                })
                .catch((err) => {
                    if (err.status === 402 || err.status === 403) {
                        ElMessage.error('token过期或无效, 请重新登录')
                        logout()
                    }
                })
            return state
        }

        const { toLayout, toLogin } = useRouterTo()

        let timer: number
        timer = setInterval(() => {
            if (!userInfo.expires_in) return
            userInfo.expires_in -= 1
            if (userInfo.expires_in <= 10) {
                refreshToken()
            }
        }, 1000)

        const login = async (data: LoginParams) => {
            loginApi(data).then(async (res) => {
                if (res.data.state === 200) {
                    userInfo.user_id = res.data.data.user_id
                    userInfo.token = res.data.data.token
                    userInfo.mobile = res.data.data.mobile
                    userInfo.username = res.data.data.username
                    userInfo.role_id = res.data.data.role_id
                    userInfo.role_name = res.data.data.role_name
                    userInfo.avatar = res.data.data.avatar
                    userInfo.expires_in = res.data.data.expires_in
                    clearInterval(timer)
                    timer = setInterval(() => {
                        userInfo.expires_in -= 1
                        if (userInfo.expires_in <= 1200) {
                            refreshToken()
                        }
                    }, 1000)
                    await getMenuApi().then((res2) => {
                        if (res2.data.state === 200) {
                            menuList.value = res2.data.data
                            for (const item of menuList.value) {
                                for (const child of item.children) {
                                    router.addRoute('Layout', {
                                        path: child.path,
                                        component: modules[`..${child.component.slice(1)}`],
                                        meta: { name1: item.auth_name, name2: child.auth_name },
                                    })
                                }
                            }
                            toLayout()
                        } else {
                            ElMessage.error('获取菜单失败')
                        }
                    })
                } else {
                    ElMessage.error('登录失败')
                }
            })
        }
        const logout = () => {
            logoutApi()
                .then((res) => {
                    if (res.data.state === 200) {
                        userInfo.token = ''
                        userInfo.mobile = ''
                        userInfo.user_id = 0
                        userInfo.role_id = ''
                        userInfo.username = ''
                        userInfo.role_name = ''
                        userInfo.avatar = ''
                        userInfo.expires_in = 0
                        menuList.value = []
                        clearInterval(timer)
                        toLogin()
                    }
                })
                .catch(() => {
                    userInfo.token = ''
                    userInfo.mobile = ''
                    userInfo.user_id = 0
                    userInfo.role_id = ''
                    userInfo.username = ''
                    userInfo.role_name = ''
                    userInfo.avatar = ''
                    userInfo.expires_in = 0
                    menuList.value = []
                    clearInterval(timer)
                    toLogin()
                })
        }

        return {
            userInfo,
            login,
            logout,
            menuList,
            modules,
            refreshToken,
        }
    },
    {
        persist: true,
    },
)
