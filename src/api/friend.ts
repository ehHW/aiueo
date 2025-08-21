import instance from '@/utils/requests'

export const getFriendListApi = () => {
    return instance.get('/user/friends/')
}

export const addFriendApi = (receiver_id: number) => {
    return instance.post('/user/friends/request/add/', {
        'receiver_id': receiver_id
    })
}

export const handleFriendRequestApi = (action: 'accept' | 'decline', sender_id: number) => {
    return instance.post('/user/friends/request/handle/', {
        'action': action,
        'sender_id': sender_id
    })
}

export const getFriendRequestListApi = () => {
    return instance.get('/user/friends/request/list/')
}
