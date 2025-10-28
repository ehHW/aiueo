import type {
    CreateGroupParams,
    CreateGroupResponse,
    FriendData,
    FriendListResponse,
    FriendRequestData,
    FriendRequestResponse,
    GetOrCreatePrivateParams,
    GetOrCreatePrivateResponse
} from '@/types/chat'
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

export const getSessionListApi = () => {
    return instance.get('/chat/conversations/')
}

export const getOrCreatePrivateApi = (data: GetOrCreatePrivateParams) => {
    return instance.post<GetOrCreatePrivateResponse>('/chat/conversations/private/', data)
}

export const createGroupApi = (data: CreateGroupParams) => {
    return instance.post<CreateGroupResponse>('/chat/conversations/group/', data)
}
