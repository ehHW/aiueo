import router from '@/router'
// import { useUserStore } from '@/stores/useUser'
import { startProgress, closeProgress } from './utils/progress'
// import { getMenuApi } from './api/menu'

router.beforeEach(async (to, from, next) => {
    startProgress() // 开启进度条
    next()
})

router.afterEach(() => {
    closeProgress() // 结束进度条
})
