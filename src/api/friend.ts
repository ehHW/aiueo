import type { FriendData, FriendListResponse, FriendRequestData, FriendRequestResponse } from '@/types/chat'
import instance from '@/utils/requests'

export const getFriendListApi = () => {
    return instance.get<FriendListResponse<FriendData[]>>('/chat/friends/')
}

export const addFriendApi = (receiver_id: number) => {
    return instance.post('/chat/friends/request/add/', {
        'receiver_id': receiver_id
    })
}

export const handleFriendRequestApi = (action: 'accept' | 'decline', sender_id: number) => {
    return instance.post('/chat/friends/request/handle/', {
        'action': action,
        'sender_id': sender_id
    })
}

export const getFriendRequestListApi = (type: 'in' | 'out' = 'in') => {
    return instance.get<FriendRequestResponse<FriendRequestData[]>>('/chat/friends/request/list/', {
        data: {
            type
        }
    })
}
