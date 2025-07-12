// import type { GetMenuPramas } from '@/types/menu'
import instance from '@/utils/requests'

export const getMenuApi = async () => {
    return await instance.post('/user/menu_list/')
}
