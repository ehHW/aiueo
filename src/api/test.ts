import instance from '@/utils/requests'

export const getTestApi = () => {
    return instance.get('/user/test/')
}

export const postTestApi = () => {
    return instance.post('/user/test/')
}
