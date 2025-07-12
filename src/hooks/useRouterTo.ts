import router from '@/router'

export default function () {
    function toLayout() {
        router.push('/layout')
        ElMessage.success('登录成功')
    }

    function toLogin() {
        router.push('/login')
    }

    function toError() {
        router.push('/404')
    }

    return {
        toLayout,
        toLogin,
        toError,
    }
}
